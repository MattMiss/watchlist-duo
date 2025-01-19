import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { User } from "../../types/firebase";
import { AuthContext } from "./authContext";
import { auth } from "../../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import initializeUserInDatabase from "../../utils/initializeUserInDatabase";
import Spinner from "../../components/Spinner";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthorizing, setIsAuthorizing] = useState<boolean>(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            console.log(firebaseUser);
          try {
            await initializeUserInDatabase(firebaseUser); // Initialize the user in Firestore
  
            const db = getFirestore();
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);
  
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setCurrentUser({
                ...firebaseUser,
                partnerCode: userData.partnerCode || "", // Default to empty string if not available
                partnerUid: userData.partnerUid || null, // Default to null
                createdAt: userData.createdAt || firebaseUser.metadata.creationTime || "", // Use metadata or default to empty string
              });
            } else {
              console.warn(`No Firestore document found for user ${firebaseUser.uid}`);
              setCurrentUser({
                ...firebaseUser,
                partnerCode: "",
                partnerUid: null,
                createdAt: firebaseUser.metadata.creationTime || "",
              });
            }
          } catch (error) {
            console.error("Error initializing user or fetching data:", error);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
  
        setIsAuthorizing(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    if (isAuthorizing) {
      return <Spinner />; 
    }
  
    return (
      <AuthContext.Provider value={{ currentUser, isAuthorizing }}>
        {children}
      </AuthContext.Provider>
    );
  };
  

export default AuthProvider;
