import { getFirestore, doc, writeBatch, getDoc } from "firebase/firestore";

export const disconnectFromPartner = async (uid: string) => {
  const db = getFirestore();

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found.");
  }

  const { partnerUid } = userSnap.data();
  if (!partnerUid) {
    throw new Error("No partner to disconnect.");
  }

  const partnerRef = doc(db, "users", partnerUid);

  // Use Firestore's writeBatch to remove the partnership
  const batch = writeBatch(db);
  batch.update(userRef, { partnerUid: null });
  batch.update(partnerRef, { partnerUid: null });

  await batch.commit();
};
