import { getFirestore, collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";

export const connectWithPartner = async (uid: string, partnerCode: string): Promise<void> => {
  const db = getFirestore();

  // Query the users collection to find the user with the given partnerCode
  const usersRef = collection(db, "users");
  const partnerQuery = query(usersRef, where("partnerCode", "==", partnerCode));
  const querySnapshot = await getDocs(partnerQuery);

  if (querySnapshot.empty) {
    throw new Error("Partner code not found.");
  }

  // Assume only one user will have this partnerCode
  const partnerDoc = querySnapshot.docs[0];
  const partnerData = partnerDoc.data();

  if (partnerData.partnerUid) {
    throw new Error("This partner is already connected with someone else.");
  }

  // Use Firestore's writeBatch to perform atomic updates
  const batch = writeBatch(db);
  const userRef = doc(usersRef, uid);
  const partnerRef = doc(usersRef, partnerDoc.id);

  batch.update(userRef, { partnerUid: partnerDoc.id });
  batch.update(partnerRef, { partnerUid: uid });

  await batch.commit();
};
