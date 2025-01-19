import React from "react";
import { Movie, TV } from "../../types/tmdb";
import { DuoPartnerListContext } from "./duoPartnerListContext";
import { useAuth } from "../auth/useAuthContext";
import { ExtendedUser } from "../../types/firebase";
import { useQuery } from "@tanstack/react-query";

const DuoPartnerListProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();

    const fetchDuoPartnerList = async (): Promise<(Movie | TV)[]> => {
        if (!currentUser) throw new Error("User not authenticated");
        
        try {
            const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/duoPartnerList`, {
                headers: {
                    Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching Duo Partner List:", error);
            throw error;
        }
    };

    const { data: duoPartnerList = [], isLoading: isLoadingDuoPartnerList, refetch: refreshDuoPartnerList } = useQuery({
        queryKey: ["duoPartnerList", currentUser?.uid],
        queryFn: fetchDuoPartnerList,
        enabled: !!currentUser, // Only run query when user is authenticated
        staleTime: 1000 * 60 * 5, // 5 minutes cache time
        gcTime: 1000 * 60 * 10, // 10 minutes before removal
    });

    return (
        <DuoPartnerListContext.Provider
            value={{ isLoadingDuoPartnerList, duoPartnerList, refreshDuoPartnerList }}
        >
            {children}
        </DuoPartnerListContext.Provider>
    );
};

export default DuoPartnerListProvider;
