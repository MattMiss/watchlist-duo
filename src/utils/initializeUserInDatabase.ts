import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../types/firebase";

const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 10); // Generate an 8-character random string
};

const initializeUserInDatabase = async (user: User): Promise<void> => {
  const db = getFirestore();
  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // If the user doesn't exist in the database, initialize their data
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        email: user.email || "No Email",
        partnerCode: generateCode(), // Generate a unique code for the user
        partner: null, // Placeholder for the partner
        createdAt: new Date().toISOString(),
      });
      console.log("User initialized in the database.");
    } else {
      console.log("User already exists in the database.");
    }
  } catch (error) {
    console.error("Error initializing user in database:", error);
    throw error; // Optionally re-throw the error to handle it in the calling function
  }
};

export default initializeUserInDatabase;
