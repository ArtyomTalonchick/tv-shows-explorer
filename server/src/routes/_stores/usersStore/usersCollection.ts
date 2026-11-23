import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { CollectionReference } from "firebase-admin/firestore";

// The collection of the accounts, `users`. Firebase starts on the first call, not on import.
export const usersCollection = (): CollectionReference => {
    if (getApps().length === 0) {
        initializeApp();
    }
    return getFirestore().collection("users");
};
