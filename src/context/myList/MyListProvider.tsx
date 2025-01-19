import React, { useState, useEffect } from "react";
import { Movie, TV } from "../../types/tmdb";
import { MyListContext } from "./myListContext";
import { useAuth } from "../auth/useAuthContext";
import { ExtendedUser } from "../../types/firebase";

const MyListProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [myList, setMyList] = useState<(Movie | TV)[]>([]);
    const [isLoadingMyList, setIsLoadingMyList] = useState(true);
    
    const refreshMyList = async () => {
        if (!currentUser) return;
    
        try {
            const idToken = (currentUser as ExtendedUser)?.stsTokenManager?.accessToken;
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/mylist`,
                {
                    method: "GET", 
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
    
            const data = await response.json();
            setMyList(data);
            setIsLoadingMyList(false);
        } catch (error) {
            console.error("Error fetching My List:", error);
        }
    };
    
  
    // Automatically fetch the list when the component mounts
    useEffect(() => {
        refreshMyList();
    }, [currentUser]);
  
    return (
        <MyListContext.Provider value={{ isLoadingMyList, myList, setMyList, refreshMyList }}>
            {children}
        </MyListContext.Provider>
    );
};

export default MyListProvider;