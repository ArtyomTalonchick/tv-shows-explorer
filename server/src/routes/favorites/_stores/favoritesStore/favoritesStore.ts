import { createMemoryStore } from "./createMemoryStore";
import type { FavoritesStore } from "./types";

// The favorites of each browser, by its client id; reached only by the tasks `listFavorites`, `addFavorite` and
// `removeFavorite`.
export const favoritesStore: FavoritesStore = createMemoryStore();
