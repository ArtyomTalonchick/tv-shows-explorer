import { createFirestoreStore } from "./createFirestoreStore";
import { createMemoryStore } from "./createMemoryStore";
import type { FavoritesStore } from "./types";

// The favorites of each browser, by its client id; reached only by the tasks `listFavorites`, `addFavorite` and
// `removeFavorite`. In Firestore when the server runs on Firebase, which sets `FIREBASE_CONFIG`; in memory
// otherwise (local development, tests), with no setup.
export const favoritesStore: FavoritesStore = process.env.FIREBASE_CONFIG
    ? createFirestoreStore()
    : createMemoryStore();
