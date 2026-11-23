import { createFirestoreStore } from "./createFirestoreStore";
import type { FavoritesStore } from "./types";

// The favorites of each browser, by its client id, in Firestore wherever the server runs, local development
// included; reached only by the tasks of the favorites routes: `listFavorites`, `addFavorite` and `removeFavorite`.
// The tests mock it.
export const favoritesStore: FavoritesStore = createFirestoreStore();
