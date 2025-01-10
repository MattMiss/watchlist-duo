import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { Movie, TV } from "../types/tmdb";
import { DuoPartnerListContext } from "./duoPartnerListContext";
import { useAuth } from "./useAuthContext";

const DuoPartnerListProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [duoPartnerList, setDuoPartnerList] = useState<(Movie | TV)[]>([]);
  const [isLoadingDuoPartnerList, setIsLoadingDuoPartnerList] = useState(true);

  const refreshDuoPartnerList = async () => {
    if (!currentUser) return;
    const db = getFirestore();

    const fetchPartnerMovies = async () => {
      if (!currentUser.partnerUid) return [];

      const moviesRef = collection(db, "users", currentUser.partnerUid, "movies");
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
            isOwner: false,
        } as Movie;
      });
    };

    const fetchPartnerTVShows = async () => {
      if (!currentUser.partnerUid) return [];

      const tvRef = collection(db, "users", currentUser.partnerUid, "tv");
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
            isOwner: false,
        } as TV;
      });
    };

    try {
      const [partnerMovieList, partnerTVList] = await Promise.all([
        fetchPartnerMovies(),
        fetchPartnerTVShows(),
      ]);
      setDuoPartnerList([...partnerMovieList, ...partnerTVList]);
      setIsLoadingDuoPartnerList(false);
    } catch (error) {
      console.error("Error fetching Duo Partner List:", error);
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
