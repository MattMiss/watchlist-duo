import { createContext } from "react";
import { Movie, TV } from "../../types/tmdb";

interface DuoPartnerListContextProps {
  isLoadingDuoPartnerList: boolean;
  duoPartnerList: (Movie | TV)[];
  refreshDuoPartnerList: () => void; // Function to manually refresh the list
}

export const DuoPartnerListContext = createContext<DuoPartnerListContextProps | null>(null);
