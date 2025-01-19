import { createContext } from "react";
import { Movie, TV } from "../../types/tmdb";

interface DuoPartnerListContextProps {
  isLoadingDuoPartnerList: boolean;
  duoPartnerList: (Movie | TV)[];
  setDuoPartnerList: React.Dispatch<React.SetStateAction<(Movie | TV)[]>>;
  refreshDuoPartnerList: () => void; // A function to manually refresh the list
}

export const DuoPartnerListContext = createContext<DuoPartnerListContextProps | undefined>(undefined);