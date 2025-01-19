import { createContext } from "react";
import { Movie, TV } from "../../types/tmdb";

interface MyListContextProps {
  isLoadingMyList: boolean;
  myList: (Movie | TV)[];
  setMyList: React.Dispatch<React.SetStateAction<(Movie | TV)[]>>;
  refreshMyList: () => void; // A function to manually refresh the list
}

export const MyListContext = createContext<MyListContextProps | undefined>(undefined);