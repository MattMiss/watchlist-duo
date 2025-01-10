import React, { useState, useEffect } from "react";
import { Movie, TV } from "../types/tmdb";
import { DuoPartnerListContext } from "./duoPartnerListContext";
import { useAuth } from "./useAuthContext";
import { ExtendedUser } from "../types/firebase";

const DuoPartnerListProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [duoPartnerList, setDuoPartnerList] = useState<(Movie | TV)[]>([]);
    const [isLoadingDuoPartnerList, setIsLoadingDuoPartnerList] = useState(true);

    const refreshDuoPartnerList = async () => {
        if (!currentUser) return;
        
        try {
            const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/duoPartnerList`,
                {
                headers: {
                    Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
                    "Content-Type": "application/json",
                },
                }
            );
            const data = await response.json();
            setDuoPartnerList(data);
            setIsLoadingDuoPartnerList(false);
        } catch (error) {
            console.error("Error fetching My List:", error);
        }
    };

    // Automatically fetch the list when the component mounts
    useEffect(() => {
        refreshDuoPartnerList();
    }, [currentUser]);

    return (
        <DuoPartnerListContext.Provider
            value={{ isLoadingDuoPartnerList, duoPartnerList, setDuoPartnerList, refreshDuoPartnerList }}
        >
            {children}
        </DuoPartnerListContext.Provider>
    );
};

export default DuoPartnerListProvider;
