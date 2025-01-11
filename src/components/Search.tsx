import { useState, useEffect } from "react";
import {
    Movie,
    TV,
    Person,
    Multi,
} from "../types/tmdb";
import MediaResultCard from "./MediaResultCard";
import { addToMyList } from "../utils/firestoreUtils";
import { toast } from "react-toastify";
import { useSearchResults } from "../context/useSearchResultsContext";
import { useAuth } from "../context/useAuthContext";
import Spinner from "./Spinner";

//const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Search = () => {
    const { currentUser } = useAuth();
    const { searchOptions, setSearchOptions, handleSearch, isLoadingSearchResults, results } = useSearchResults();
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);

    // Trigger handleSearch when `page` or `searchType` changes and `shouldSearch` is true
    useEffect(() => {
        if (shouldSearch) {
            handleSearch();
            setShouldSearch(false); // Reset to prevent redundant searches
        }
    }, [searchOptions.page, shouldSearch]);

    
    const handlePageChange = (page: number) => {
        setSearchOptions({ page: page })
        setShouldSearch(true); // Indicate that handleSearch should be triggered
    };

    const handleAddToList = async (media: Movie | TV, type: "movie" | "tv") => {
        if (!currentUser) {
            toast.error("You must be logged in to add items to your list.");
            return;
        }

        try {
            await addToMyList(currentUser.uid, media, type);
        } catch (error) {
            console.error("Error adding media to list:", error);
        }
    };

    console.log(searchOptions.page);

    const renderMediaResults = (results: (Movie | TV | Person | Multi)[]) => {
        return results.map((result) => {
            // Handle multi search results with media_type
            if ((result as Movie | TV | Person | Multi).media_type) {
                if (result.media_type === "movie") {
                    return (
                        <MediaResultCard
                            key={result.id}
                            media={result as Movie}
                            type="movie"
                            actionLabel="Add to My List"
                            onActionClick={() => handleAddToList(result as Movie, "movie")}
                        />
                    );
                } else if (result.media_type === "tv") {
                    return (
                        <MediaResultCard
                            key={result.id}
                            media={result as TV}
                            type="tv"
                            actionLabel="Add to My List"
                            onActionClick={() => handleAddToList(result as TV, "tv")}
                        />
                    );
                } else if (result.media_type === "person") {
                    return null;
                }
            }
            // Handle results from specific search types (movie or tv)
            if ("title" in result) {
                return (
                    <MediaResultCard
                        key={result.id}
                        media={result as Movie}
                        type="movie"
                        actionLabel="Add to My List"
                        onActionClick={() => handleAddToList(result as Movie, "movie")}
                    />
                );
            } else if ("name" in result && "first_air_date" in result) {
                return (
                    <MediaResultCard
                        key={result.id}
                        media={result as TV}
                        type="tv"
                        actionLabel="Add to My List"
                        onActionClick={() => handleAddToList(result as TV, "tv")}
                    />
                );
            }
            return null; // Ignore unsupported result types
        });
    };
    
    
    

    return (
        <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Search</h1>
            <div className="mb-6 w-full">
            <input
                type="text"
                value={searchOptions.query}
                onChange={(e) =>
                    setSearchOptions({ query: e.target.value })
                }
                placeholder="Search for movies, TV shows, or people..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && searchOptions.query) {
                        handleSearch();
                    }
                }}
            />
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
                <div className="flex items-center text-gray-600">
                    <div className="mb-4">
                        <label className="flex items-center space-x-3">
                            <span>Include Adult Content:</span>
                            <input
                                type="checkbox"
                                checked={searchOptions.includeAdult}
                                onChange={(e) =>
                                    setSearchOptions({ includeAdult: e.target.checked })
                                }
                                className="w-4 h-4"
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center space-x-3">
                            <span>Exclude Incomplete Results:</span>
                            <input
                                type="checkbox"
                                checked={searchOptions.excludeIncomplete}
                                onChange={(e) =>
                                    setSearchOptions({ excludeIncomplete: e.target.checked })
                                  }
                                className="w-4 h-4"
                            />
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Search Type
                        </label>
                        <select
                            value={searchOptions.searchType}
                            onChange={(e) =>
                                setSearchOptions({ searchType: e.target.value as "movie" | "tv" | "person" | "multi" })
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="movie">Movies</option>
                            <option value="tv">TV Shows</option>
                            <option value="person">People</option>
                            <option value="multi">All</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Language</label>
                        <input
                            type="text"
                            value={searchOptions.language}
                            onChange={(e) =>
                                setSearchOptions({ language: e.target.value})
                            }
                            placeholder="e.g., en-US"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Primary Release Year
                        </label>
                        <input
                            type="text"
                            value={searchOptions.primaryReleaseYear}
                            onChange={(e) =>
                                setSearchOptions({ primaryReleaseYear: e.target.value })
                            }
                            placeholder="e.g., 2023"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Year</label>
                        <input
                            type="text"
                            value={searchOptions.year}
                            onChange={(e) =>
                                setSearchOptions({ year: e.target.value })
                            }
                            placeholder="e.g., 2023"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Region</label>
                        <input
                            type="text"
                            value={searchOptions.region}
                            onChange={(e) =>
                                setSearchOptions({ region: e.target.value })
                            }
                            placeholder="e.g., US"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Page</label>
                        <input
                            type="number"
                            value={searchOptions.page}
                            onChange={(e) => handlePageChange(Number(e.target.value))}                      
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            >
                Search
            </button>

            <div className="mt-6">
                {isLoadingSearchResults ? (
                    <Spinner /> // Render the Spinner component when loading
                ) : results.length > 0 ? (
                    renderMediaResults(results) // Render media results if results exist
                ) : (
                    <p className="text-gray-600">
                        No results found. Try searching with different filters!
                    </p> // Show message if no results are found
                )}
            </div>
        </div>
    );
};

export default Search;
