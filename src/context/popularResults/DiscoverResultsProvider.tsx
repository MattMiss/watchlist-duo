import React, { useState } from "react";
import axios from "axios";
import { Movie, TV } from "../../types/tmdb";
import { toast } from "react-toastify";
import { DiscoverOptions } from "../../types/tmdb";
import { DiscoverResultsContext } from "./discoverResultsContext";
import { useAuth } from "../auth/useAuthContext";
import { ExtendedUser } from "../../types/firebase";
import { useQuery } from "@tanstack/react-query";

const DiscoverResultsProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
  
    // Default discover options
    const [discoverOptions, setDiscoverOptions] = useState<DiscoverOptions>({
        language: "en-US",
        mediaType: "movie",
        discoverType: "popular",
        timeWindow: "week",
        excludeIncomplete: false,
        page: 1,
    });

    const fetchDiscoverResults = async () => {
        if (!currentUser) {
            toast.error("User not authenticated. Please log in.");
            throw new Error("User not authenticated");
        }

        const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;

        const discoverTypeMap = {
            popular: "popular",
            trending: "trending",
        };

        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${discoverTypeMap[discoverOptions.discoverType]}`;

        const response = await axios.get<{ results: (Movie | TV)[] }>(apiUrl, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
            },
            params: {
                language: discoverOptions.language,
                mediaType: discoverOptions.mediaType,
                discoverType: discoverOptions.discoverType,
                timeWindow: discoverOptions.timeWindow,
                page: discoverOptions.page,
            },
        });

        return response.data.results;
    };

    const { data: results = [], isLoading: isLoadingDiscoverResults, refetch: refreshDiscoverResults } = useQuery({
        queryKey: ["discoverResults", discoverOptions],
        queryFn: fetchDiscoverResults,
        enabled: !!currentUser, // Only fetch when the user is logged in
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });

    return (
        <DiscoverResultsContext.Provider
            value={{
                isLoadingDiscoverResults,
                results,
                discoverOptions,
                setDiscoverOptions: (options) => setDiscoverOptions((prevOptions) => ({ ...prevOptions, ...options })),
                refreshDiscoverResults, // Refetching function exposed to components
            }}
        >
            {children}
        </DiscoverResultsContext.Provider>
    );
};

export default DiscoverResultsProvider;
