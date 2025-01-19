import { createContext } from "react";
import { Movie, TV, DiscoverOptions } from "../../types/tmdb";

interface DiscoverResultsContextProps {
    isLoadingDiscoverResults: boolean;
    results: (Movie | TV)[];
    discoverOptions: DiscoverOptions;
    setDiscoverOptions: (options: Partial<DiscoverOptions>) => void;
    refreshDiscoverResults: () => void;  // Renamed for consistency with other contexts
}

// Provide a default context value to avoid potential undefined issues in consumers
export const DiscoverResultsContext = createContext<DiscoverResultsContextProps>({
    isLoadingDiscoverResults: false,
    results: [],
    discoverOptions: {
        language: "en-US",
        mediaType: "movie",
        discoverType: "popular",
        timeWindow: "week",
        excludeIncomplete: false,
        page: 1,
    },
    setDiscoverOptions: () => {},
    refreshDiscoverResults: () => {},
});
