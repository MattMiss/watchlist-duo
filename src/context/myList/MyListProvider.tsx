import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Movie, TV } from "../../types/tmdb";
import { MyListContext } from "./myListContext";
import { useAuth } from "../auth/useAuthContext";
import { ExtendedUser } from "../../types/firebase";
import { toast } from "react-toastify";

const MyListProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    // Fetch user's list function
    const fetchMyList = async (): Promise<(Movie | TV)[]> => {
        if (!currentUser) throw new Error("User not authenticated");

        const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/mylist`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return response.json();
    };

    // Use TanStack Query to manage the fetching and caching
    const { data: myList = [], isLoading: isLoadingMyList } = useQuery({
        queryKey: ["myList", currentUser?.uid],
        queryFn: fetchMyList,
        enabled: !!currentUser, // Fetch only if user is logged in
        staleTime: 1000 * 60 * 5, // 5 minutes cache time
        gcTime: 1000 * 60 * 10, // 10 minutes before removal
    });

    // Mutation to add media
    const addMutation = useMutation({
        mutationFn: async ({ media, type }: { media: Movie | TV; type: "movie" | "tv" }) => {
            if (!currentUser) throw new Error("User not authenticated");

            const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/mylist`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ media, type }),
            });

            if (!response.ok) {
                throw new Error(`Failed to add: ${response.statusText}`);
            }

            toast.success(`${type === "movie" ? "Movie" : "TV Show"} added to your list!`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myList", currentUser?.uid] });
        },
        onError: () => {
            toast.error("Failed to add to your list. Please try again.");
        },
    });

    // Mutation to delete media
    const deleteMutation = useMutation({
        mutationFn: async ({ mediaId, type }: { mediaId: string; type: "movie" | "tv" }) => {
            if (!currentUser) throw new Error("User not authenticated");

            const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/mylist`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mediaId, type }),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete: ${response.statusText}`);
            }

            toast.success(`${type === "movie" ? "Movie" : "TV Show"} removed successfully!`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myList", currentUser?.uid] });
        },
        onError: () => {
            toast.error("Failed to remove from your list. Please try again.");
        },
    });

    return (
        <MyListContext.Provider
            value={{
                isLoadingMyList,
                myList,
                refreshMyList: () => queryClient.invalidateQueries({ queryKey: ["myList", currentUser?.uid] }),
                addToMyList: (media, type) => addMutation.mutate({ media, type }),
                deleteFromMyList: (mediaId, type) => deleteMutation.mutate({ mediaId, type }),
                isAddingToList: addMutation.isPending,
                isDeletingFromList: deleteMutation.isPending,
            }}
        >
            {children}
        </MyListContext.Provider>
    );
};

export default MyListProvider;
