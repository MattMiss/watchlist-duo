import React, { useState } from "react";
import axios from "axios";
import { Movie, TV, Person } from "../types/tmdb";
import { toast } from "react-toastify";
import { SearchOptions } from "../types/tmdb";
import { SearchResultsContext } from "./searchResultsContext";
import { useAuth } from "./useAuthContext";
import { ExtendedUser } from "../types/firebase";

const SearchResultsProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [results, setResults] = useState<(Movie | TV | Person)[]>([]);
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  
    // Default search options
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
  
    const handleSearch = async () => {
        if (!searchOptions.query) return;
    
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/search`;
    
        try {
            if (!currentUser) {
                toast.error("User not authenticated. Please log in.");
                return;
            }

            const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;

            setIsLoadingSearchResults(true);
    
            // Define the response type dynamically based on `searchType`
            let response;
            if (searchOptions.searchType === "movie") {
                response = await axios.get<{ results: Movie[] }>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Add the token in the header
                        "Content-Type": "application/json",
                    },
                        params: {
                        query: searchOptions.query,
                        includeAdult: searchOptions.includeAdult,
                        language: searchOptions.language,
                        primaryReleaseYear: searchOptions.primaryReleaseYear || undefined,
                        year: searchOptions.year || undefined,
                        region: searchOptions.region || undefined,
                        searchType: searchOptions.searchType,
                        page: searchOptions.page,
                    },
                });
            } else if (searchOptions.searchType === "tv") {
                response = await axios.get<{ results: TV[] }>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Add the token in the header
                        "Content-Type": "application/json",
                    },
                        params: {
                        query: searchOptions.query,
                        includeAdult: searchOptions.includeAdult,
                        language: searchOptions.language,
                        primaryReleaseYear: searchOptions.primaryReleaseYear || undefined,
                        year: searchOptions.year || undefined,
                        region: searchOptions.region || undefined,
                        searchType: searchOptions.searchType,
                        page: searchOptions.page,
                    },
                });
            } else if (searchOptions.searchType === "person") {
                response = await axios.get<{ results: Person[] }>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Add the token in the header
                        "Content-Type": "application/json",
                    },
                        params: {
                        query: searchOptions.query,
                        includeAdult: searchOptions.includeAdult,
                        language: searchOptions.language,
                        searchType: searchOptions.searchType,
                        page: searchOptions.page,
                    },
                });
            } else {
                response = await axios.get<{ results: (Movie | TV | Person)[] }>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Add the token in the header
                        "Content-Type": "application/json",
                    },
                        params: {
                        query: searchOptions.query,
                        includeAdult: searchOptions.includeAdult,
                        language: searchOptions.language,
                        primaryReleaseYear: searchOptions.primaryReleaseYear || undefined,
                        year: searchOptions.year || undefined,
                        region: searchOptions.region || undefined,
                        searchType: searchOptions.searchType,
                        page: searchOptions.page,
                    },
                });
            }
    
            const filteredResults = searchOptions.excludeIncomplete
            ? response.data.results.filter((result) => {
                if ("poster_path" in result) {
                    return result.poster_path && result.vote_average !== undefined && result.vote_average > 0;
                }
                return true;
                })
            : response.data.results;
    
            setResults(filteredResults);
        } catch (error) {
            toast.error("Error fetching results. Please refresh and try again.");
            console.error("Error fetching results:", error);
        } finally {
            setIsLoadingSearchResults(false);
        }
    };

  return (
        <SearchResultsContext.Provider
            value={{
                isLoadingSearchResults,
                results,
                searchOptions,
                setSearchOptions: (options) =>
                setSearchOptions((prevOptions) => ({ ...prevOptions, ...options })),
                handleSearch,
            }}
        >
            {children}
        </SearchResultsContext.Provider>
    );
};

export default SearchResultsProvider;
