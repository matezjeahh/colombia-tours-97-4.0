// lib/firestore.js
import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export async function getData(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({
    teszt: doc.teszt,
    ...doc.data(),
  }));
}

export async function getDocumentData(collectionName, documentId) {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}
