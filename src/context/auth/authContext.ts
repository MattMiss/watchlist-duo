import { createContext } from "react";
import { User } from "../../types/firebase";

interface AuthContextType {
    currentUser: User | null;
    isAuthorizing: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>({
    currentUser: null,
    isAuthorizing: true,
});
