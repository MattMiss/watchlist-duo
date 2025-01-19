import { createContext } from "react";
import { Movie, TV } from "../../types/tmdb";
import { DiscoverOptions } from "../../types/tmdb";


interface DiscoverResultsContextProps {
    isLoadingDiscoverResults: boolean;
    results: (Movie | TV )[];
    discoverOptions: DiscoverOptions;
    setDiscoverOptions: (options: Partial<DiscoverOptions>) => void;
    handleSearch: () => void;
}

export const DiscoverResultsContext = createContext<DiscoverResultsContextProps | undefined>(
    undefined
);
