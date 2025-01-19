import { createContext } from "react";
import { Movie, TV } from "../../types/tmdb";

interface MyListContextProps {
    isLoadingMyList: boolean;
    myList: (Movie | TV)[];
    refreshMyList: () => void;
    addToMyList: (media: Movie | TV, type: "movie" | "tv") => void;
    deleteFromMyList: (mediaId: string, type: "movie" | "tv") => void;
    isAddingToList: boolean;
    isDeletingFromList: boolean;
}

export const MyListContext = createContext<MyListContextProps | undefined>(undefined);
