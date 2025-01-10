import { useContext } from "react";
import { SearchResultsContext } from "./searchResultsContext";

export const useSearchResults = () => {
    const context = useContext(SearchResultsContext);
    if (!context) {
      throw new Error("useSearchResults must be used within a SearchResultsProvider");
    }
    return context;
  };