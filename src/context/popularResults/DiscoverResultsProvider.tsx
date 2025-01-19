import React, { useState } from "react";
import axios from "axios";
import { Movie, TV } from "../../types/tmdb";
import { toast } from "react-toastify";
import { DiscoverOptions } from "../../types/tmdb";
import { DiscoverResultsContext } from "./discoverResultsContext";
import { useAuth } from "../auth/useAuthContext";
import { ExtendedUser } from "../../types/firebase";

const DiscoverResultsProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [results, setResults] = useState<(Movie | TV )[]>([]);
    const [isLoadingDiscoverResults, setIsLoadingDiscoverResults] = useState(false);
  
    // Default search options
    const [discoverOptions, setDiscoverOptions] = useState<DiscoverOptions>({
        language: "en-US",
        mediaType: "movie",
        discoverType: "popular",
        timeWindow: "week",
        excludeIncomplete: false,
        page: 1,
    });
  
    const handleSearch = async () => {

        const discoverTypeMap = {
            popular: "popular",
            trending: "trending"
        };
    
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/${discoverTypeMap[discoverOptions.discoverType]}`;
    
        try {
            if (!currentUser) {
                toast.error("User not authenticated. Please log in.");
                return;
            }

            const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;

            setIsLoadingDiscoverResults(true);
    
            // Define the response type dynamically based on `searchType`
            let response;
            if (discoverOptions.mediaType === "movie") {
                response = await axios.get<{ results: Movie[] }>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Add the token in the header
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
            } else if (discoverOptions.mediaType === "tv") {
                response = await axios.get<{ results: TV[] }>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Add the token in the header
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
            } 
            else {
                response = await axios.get<{ results: (Movie | TV)[] }>(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Add the token in the header
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
            }
    
            // const filteredResults = searchOptions.excludeIncomplete
            // ? response.data.results.filter((result) => {
            //     if ("poster_path" in result) {
            //         return result.poster_path && result.vote_average !== undefined && result.vote_average > 0;
            //     }
            //     return true;
            //     })
            // : response.data.results;

            console.log(response.data.results);
    
            setResults(response.data.results);
        } catch (error) {
            toast.error("Error fetching results. Please refresh and try again.");
            console.error("Error fetching results:", error);
        } finally {
            setIsLoadingDiscoverResults(false);
        }
    };

  return (
        <DiscoverResultsContext.Provider
            value={{
                isLoadingDiscoverResults,
                results,
                discoverOptions,
                setDiscoverOptions: (options) =>
                    setDiscoverOptions((prevOptions) => ({ ...prevOptions, ...options })),
                handleSearch,
            }}
        >
            {children}
        </DiscoverResultsContext.Provider>
    );
};

export default DiscoverResultsProvider;
