import { useState, useEffect } from "react";
import {
    Movie,
    TV
} from "../types/tmdb";
import MediaResultCard from "./MediaResultCard";
import { addToMyList } from "../utils/firestoreUtils";
import { toast } from "react-toastify";
import { useDiscoverResults } from "../context/popularResults/useDiscoverResultsContext";
import { useAuth } from "../context/auth/useAuthContext";
import Spinner from "./Spinner";


const Discover = () => {
    const { currentUser } = useAuth();
    const { discoverOptions, setDiscoverOptions, handleSearch, isLoadingDiscoverResults, results } = useDiscoverResults();
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);

    // Trigger handleSearch when `page` or `searchType` changes and `shouldSearch` is true
    useEffect(() => {
        if (shouldSearch) {
            handleSearch();
            setShouldSearch(false); // Reset to prevent redundant searches
        }
    }, [discoverOptions.page, shouldSearch]);

    
    const handlePageChange = (page: number) => {
        setDiscoverOptions({ page: page })
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

    console.log(discoverOptions.page);

    const renderMediaResults = (results: (Movie | TV)[]) => {
        return results.map((result) => {
            // Handle multi search results with media_type
            if ((result as Movie | TV).media_type) {
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
                } else {
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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Discover</h1>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
                <div className="flex items-center text-gray-600">
                    
                    <div className="mb-4">
                        <label className="flex items-center space-x-3">
                            <span>Exclude Incomplete Results:</span>
                            <input
                                type="checkbox"
                                checked={discoverOptions.excludeIncomplete}
                                onChange={(e) =>
                                    setDiscoverOptions({ excludeIncomplete: e.target.checked })
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
                            value={discoverOptions.mediaType}
                            onChange={(e) =>
                                setDiscoverOptions({ mediaType: e.target.value as "movie" | "tv" })
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="movie">Movies</option>
                            <option value="tv">TV Shows</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Discover Type
                        </label>
                        <select
                            value={discoverOptions.discoverType}
                            onChange={(e) =>
                                setDiscoverOptions({ discoverType: e.target.value as "popular" | "trending" })
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="popular">Popular</option>
                            <option value="trending">Trending</option>
                        </select>
                    </div>
                    {discoverOptions.discoverType == "trending" && <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Trending Time Window
                        </label>
                        <select
                            value={discoverOptions.timeWindow}
                            onChange={(e) =>
                                setDiscoverOptions({ timeWindow: e.target.value as "week" | "day" })
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                        </select>
                    </div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Language</label>
                        <input
                            type="text"
                            value={discoverOptions.language}
                            onChange={(e) =>
                                setDiscoverOptions({ language: e.target.value})
                            }
                            placeholder="e.g., en-US"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Page</label>
                        <input
                            type="number"
                            value={discoverOptions.page}
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
                {`Get ${discoverOptions.discoverType} ${discoverOptions.mediaType}s`} 
            </button>

            <div className="mt-6">
                {isLoadingDiscoverResults ? (
                    <Spinner /> // Render the Spinner component when loading
                ) : results.length > 0 ? (
                    renderMediaResults(results) // Render media results if results exist
                ) : (
                    <p className="text-gray-600">
                        No results found. Somethign went wrong!
                    </p> // Show message if no results are found
                )}
            </div>
        </div>
    );
};

export default Discover;
