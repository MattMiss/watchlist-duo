import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 10); // Generate an 8-character random string
};

interface UserDocument {
  uid: string;
  displayName: string;
  email: string;
  partnerCode: string;
  partner: string | null;
  createdAt: string;
}

const initializeUserInDatabase = async (user: User): Promise<void> => {
  const db = getFirestore();
  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Generate a unique code and ensure no collisions
      let partnerCode = generateCode();
      let isUnique = false;

      while (!isUnique) {
        const existingCodeSnap = await getDoc(doc(db, "partnerCodes", partnerCode));
        if (!existingCodeSnap.exists()) {
          isUnique = true;
        } else {
          partnerCode = generateCode(); // Regenerate if the code already exists
        }
      }

      // If the user doesn't exist in the database, initialize their data
      const userData: UserDocument = {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        email: user.email || "No Email",
        partnerCode,
        partner: null, // Placeholder for the partner
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, userData);
      console.log("User initialized in the database.");

      // Optionally track partner codes to ensure uniqueness
      await setDoc(doc(db, "partnerCodes", partnerCode), { uid: user.uid });
    } else {
      console.log("User already exists in the database.");
    }
  } catch (error) {
    console.error("Error initializing user in database:", error);
    throw error; // Optionally re-throw the error to handle it in the calling function
  }
};

export default initializeUserInDatabase;
