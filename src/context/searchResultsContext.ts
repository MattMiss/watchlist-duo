import { createContext } from "react";
import { Movie, TV, Person } from "../types/tmdb";
import { SearchOptions } from "../types/tmdb";


interface SearchResultsContextProps {
  isLoadingSearchResults: boolean;
  results: (Movie | TV | Person)[];
  searchOptions: SearchOptions;
  setSearchOptions: (options: Partial<SearchOptions>) => void;
  handleSearch: () => void;
}

export const SearchResultsContext = createContext<SearchResultsContextProps | undefined>(
  undefined
);
