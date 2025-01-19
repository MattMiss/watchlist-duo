import { useContext } from "react";
import { DuoPartnerListContext } from "./duoPartnerListContext";

export const useDuoPartnerList = () => {
  const context = useContext(DuoPartnerListContext);
  if (!context) {
    throw new Error("useMyList must be used within a MyListProvider");
  }
  return context;
};
