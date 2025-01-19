import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Movie, TV, Person, SearchOptions } from "../../types/tmdb";
import { useAuth } from "../auth/useAuthContext";
import { SearchResultsContext } from "./searchResultsContext";
import { ExtendedUser } from "../../types/firebase";
import { toast } from "react-toastify";

const SearchResultsProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [searchOptions, setSearchOptions] = useState<SearchOptions>({
        query: "",
        includeAdult: false,
        language: "en-US",
        primaryReleaseYear: "",
        year: "",
        region: "",
        searchType: "multi",
        excludeIncomplete: false,
        page: 1,
    });

    const fetchSearchResults = async () => {
        if (!currentUser) {
            throw new Error("User not authenticated. Please log in.");
        }

        const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;

        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/search`;

        const response = await axios.get<{ results: (Movie | TV | Person)[] }>(apiUrl, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
            },
            params: {
                query: searchOptions.query.trim(),
                includeAdult: searchOptions.includeAdult,
                language: searchOptions.language,
                primaryReleaseYear: searchOptions.primaryReleaseYear || undefined,
                year: searchOptions.year || undefined,
                region: searchOptions.region || undefined,
                searchType: searchOptions.searchType,
                page: searchOptions.page,
            },
        });

        return response.data.results;
    };

    const {
        data: results = [],
        isLoading: isLoadingSearchResults,
        refetch: refetchSearchResults,
        error,
    } = useQuery({
        queryKey: ["searchResults", searchOptions],
        queryFn: fetchSearchResults,
        enabled: !!searchOptions.query, // Only fetch when a query is provided
        retry: false,
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });

    // Handle errors separately
    useEffect(() => {
        if (error) {
            toast.error("Error fetching results. Please refresh and try again.");
            console.error("Error fetching results:", error);
        }
    }, [error]);

    return (
        <SearchResultsContext.Provider
            value={{
                isLoadingSearchResults,
                results,
                searchOptions,
                setSearchOptions: (options) =>
                    setSearchOptions((prevOptions) => ({ ...prevOptions, ...options })),
                refetchSearchResults,
            }}
        >
            {children}
        </SearchResultsContext.Provider>
    );
};

export default SearchResultsProvider;
