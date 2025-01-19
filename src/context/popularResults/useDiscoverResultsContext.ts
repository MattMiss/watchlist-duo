import { useContext } from "react";
import { DiscoverResultsContext } from "./discoverResultsContext";

export const useDiscoverResults = () => {
    const context = useContext(DiscoverResultsContext);
    if (!context) {
      throw new Error("useDiscoverResults must be used within a DiscoverResultsProvider");
    }
    return context;
  };