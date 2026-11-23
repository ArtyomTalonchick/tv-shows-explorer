import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { CollectionReference } from "firebase-admin/firestore";

// The collection of one browser's favorites, `clients/{clientId}/favorites`. Firebase starts on the first call, not
// on import.
export const favoritesOf = (clientId: string): CollectionReference => {
    if (getApps().length === 0) {
        initializeApp();
    }
    return getFirestore().collection("clients").doc(clientId).collection("favorites");
};
