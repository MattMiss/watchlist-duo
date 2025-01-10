import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { User } from "../types/firebase";
import { AuthContext } from "./authContext";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import initializeUserInDatabase from "../utils/initializeUserInDatabase";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          await initializeUserInDatabase(firebaseUser); // Initialize user in the database
        } catch (error) {
          console.error("Error initializing user in database:", error);
        }

        const db = getFirestore();
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setCurrentUser({
            ...firebaseUser,
            partnerCode: userData.partnerCode || null,
            partnerUid: userData.partnerUid || null,
          });
        } else {
          setCurrentUser(null); // If user data doesn't exist, handle accordingly
        }
      }else {
        setCurrentUser(null);
      }
      
      setIsAuthorizing(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthorizing }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
