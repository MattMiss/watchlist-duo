import React, { useState } from "react";
import axios from "axios";
import { Movie, TV, Person, MovieResults, TVResults, PersonResults, MultiResults } from "../types/tmdb";
import { toast } from "react-toastify";
import { SearchOptions } from "../types/tmdb";
import { SearchResultsContext } from "./searchResultsContext";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// interface SearchResultsContextType {
//   isLoadingSearchResults: boolean;
//   results: (Movie | TV | Person)[];
//   searchOptions: SearchOptions;
//   setSearchOptions: (options: Partial<SearchOptions>) => void;
//   handleSearch: () => void;
// }

// interface SearchOptions {
//   query: string;
//   includeAdult: boolean;
//   language: string;
//   primaryReleaseYear: string;
//   year: string;
//   region: string;
//   searchType: "movie" | "tv" | "person" | "multi";
//   excludeIncomplete: boolean;
//   page: number;
// }

// //export const SearchResultsContext = createContext<SearchResultsContextType | undefined>(undefined);
// export const SearchResultsContext = createContext<SearchResultsContextType>({
//   isLoadingSearchResults: false,
//   results: [],
//   searchOptions: {
//     query: "",
//     includeAdult: false,
//     language: "en-US",
//     primaryReleaseYear: "",
//     year: "",
//     region: "",
//     searchType: "multi",
//     excludeIncomplete: false,
//     page: 1,
//   },
//   setSearchOptions: () => {},
//   handleSearch: () => {},
// });

const SearchResultsProvider = ({ children }: { children: React.ReactNode }) => {
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

    const apiUrlMap: Record<"movie" | "tv" | "person" | "multi", string> = {
      movie: "https://api.themoviedb.org/3/search/movie",
      tv: "https://api.themoviedb.org/3/search/tv",
      person: "https://api.themoviedb.org/3/search/person",
      multi: "https://api.themoviedb.org/3/search/multi",
    };

    try {
      setIsLoadingSearchResults(true);
      const response = await axios.get<MovieResults | TVResults | PersonResults | MultiResults>(
        apiUrlMap[searchOptions.searchType],
        {
          params: {
            api_key: TMDB_API_KEY,
            query: searchOptions.query,
            include_adult: searchOptions.includeAdult,
            language: searchOptions.language,
            primary_release_year: searchOptions.primaryReleaseYear || undefined,
            year: searchOptions.year || undefined,
            region: searchOptions.region || undefined,
            page: searchOptions.page,
          },
        }
      );

      const filteredResults = searchOptions.excludeIncomplete
        ? (response.data.results as (Movie | TV | Person)[]).filter((result) => {
            if ("poster_path" in result) {
              return result.poster_path && result.vote_average !== undefined && result.vote_average > 0;
            }
            return true;
          })
        : response.data.results;

      setResults(filteredResults);
    } catch (error) {
      toast.error("Error fetching results. Please refresh and try again.");
      console.error("Error fetching results:", (error as Error).message);
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
