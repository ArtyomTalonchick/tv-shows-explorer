import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { Favorite } from "@tv-shows-explorer/shared";
import type { CollectionReference } from "firebase-admin/firestore";
import type { FavoritesStore } from "./types";

// The favorites kept in Firestore, a document per show: `clients/{clientId}/favorites/{showId}`. Inside Cloud
// Functions the Admin SDK finds its project and credentials on its own, so the code holds no key. Firebase starts
// on the first call, not on import.
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
        has: async (clientId, id) => {
            const snapshot = await favoritesOf(clientId).doc(String(id)).get();
            return snapshot.exists;
        },
        put: async (clientId, favorite) => {
            await favoritesOf(clientId).doc(String(favorite.id)).set(favorite);
        },
        remove: async (clientId, id) => {
            await favoritesOf(clientId).doc(String(id)).delete();
        },
        // Never forgets the favorites of real browsers: only the memory store is cleared, in tests.
        clear: async () => {
            throw new Error("The Firestore favorites store is never cleared");
        },
    };
};
