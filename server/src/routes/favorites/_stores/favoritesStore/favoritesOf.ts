import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { CollectionReference } from "firebase-admin/firestore";

// The collection of one user's favorites, `users/{userId}/favorites`. Firebase starts on the first call, not
// on import.
export const favoritesOf = (userId: string): CollectionReference => {
    if (getApps().length === 0) {
        initializeApp();
    }
    return getFirestore().collection("users").doc(userId).collection("favorites");
};
