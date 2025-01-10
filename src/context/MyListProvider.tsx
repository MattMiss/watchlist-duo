import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { Movie, TV } from "../types/tmdb";
import { MyListContext } from "./myListContext";
import { useAuth } from "./useAuthContext";

const MyListProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [myList, setMyList] = useState<(Movie | TV)[]>([]);
    const [isLoadingMyList, setIsLoadingMyList] = useState(true);

    const refreshMyList = async () => {
      if (!currentUser) return;
      const db = getFirestore();
    
      const fetchMovies = async () => {
        const moviesRef = collection(db, "users", currentUser.uid, "movies");
        const moviesSnapshot = await getDocs(query(moviesRef));
        return moviesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: Number(doc.id),
            title: data.name || "Unknown",
            release_date: data.year ? `${data.year}-01-01` : undefined,
            vote_average: data.rating || 0,
            poster_path: data.poster_path || null,
            media_type: "movie",
            isOwner: true,
          } as Movie;
        });
      };
    
      const fetchTVShows = async () => {
        const tvRef = collection(db, "users", currentUser.uid, "tv");
        const tvSnapshot = await getDocs(query(tvRef));
        return tvSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: Number(doc.id),
            name: data.name || "Unknown",
            first_air_date: data.year ? `${data.year}-01-01` : undefined,
            vote_average: data.rating || 0,
            poster_path: data.poster_path || null,
            media_type: "tv",
            isOwner: true,
          } as TV;
        });
      };
    
      try {
        const [movieList, tvList] = await Promise.all([fetchMovies(), fetchTVShows()]);
        setMyList([...movieList, ...tvList]);
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