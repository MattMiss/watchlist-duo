import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import MyListProvider from "./context/MyListProvider";
import SearchResultsProvider from "./context/SearchResultsProvider";
import DuoPartnerListProvider from "./context/DuoPartnerListProvider";


ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <MyListProvider>
                <DuoPartnerListProvider>
                    <SearchResultsProvider>
                        <App />
                    </SearchResultsProvider>
                </DuoPartnerListProvider>
            </MyListProvider>
        </AuthProvider>
    </React.StrictMode>
);