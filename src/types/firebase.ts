import { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
    partnerCode: string;            // User's unique partner code (optional for Firebase user context)
    partnerUid: string | null;         // UID of the connected partner, if any (nullable)
    createdAt: string;              // Timestamp of account creation (optional for Firebase user context)
}

// Extender user used for retrieving idToken
export interface ExtendedUser extends FirebaseUser {
    stsTokenManager?: {
        accessToken: string;
        refreshToken: string;
        expirationTime: number;
    };
}

