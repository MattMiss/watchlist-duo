import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/auth/AuthProvider";
import MyListProvider from "./context/myList/MyListProvider";
import SearchResultsProvider from "./context/searchResults/SearchResultsProvider";
import DuoPartnerListProvider from "./context/duoPartnerList/DuoPartnerListProvider";
import PopularResultsProvider from "./context/popularResults/DiscoverResultsProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MyListProvider>
                    <DuoPartnerListProvider>
                        <SearchResultsProvider>
                            <PopularResultsProvider>
                                <App />
                            </PopularResultsProvider>
                        </SearchResultsProvider>
                    </DuoPartnerListProvider>
                </MyListProvider>
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);