import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { Favorite } from "@tv-shows-explorer/shared";
import type { CollectionReference } from "firebase-admin/firestore";
import type { FavoritesStore } from "./types";

// The favorites kept in Firestore, a document per show: `clients/{clientId}/favorites/{showId}`. The Admin SDK finds
// its project and credentials on its own: inside Cloud Functions from Firebase, locally from Application Default
// Credentials and `GOOGLE_CLOUD_PROJECT`, so the code holds no key. Firebase starts on the first call, not on import.
export const createFirestoreStore = (): FavoritesStore => {
    const favoritesOf = (clientId: string): CollectionReference => {
        if (getApps().length === 0) {
            initializeApp();
        }
        return getFirestore().collection("clients").doc(clientId).collection("favorites");
    };

    return {
        list: async (clientId) => {
            const snapshot = await favoritesOf(clientId).get();
            return snapshot.docs.map((doc) => doc.data() as Favorite);
        },
        get: async (clientId, id) => {
            const snapshot = await favoritesOf(clientId).doc(String(id)).get();
            return snapshot.exists ? (snapshot.data() as Favorite) : null;
        },
        put: async (clientId, favorite) => {
            await favoritesOf(clientId).doc(String(favorite.id)).set(favorite);
        },
        remove: async (clientId, id) => {
            await favoritesOf(clientId).doc(String(id)).delete();
        },
    };
};
