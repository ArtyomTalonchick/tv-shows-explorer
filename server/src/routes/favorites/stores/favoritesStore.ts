import type { Favorite } from "@tv-shows-explorer/shared";

// One browser's favorites by show id.
export type ClientFavorites = Map<number, Favorite>;

const globalStore = globalThis as typeof globalThis & { favoritesStore?: Map<string, ClientFavorites> };

// The favorites of each browser, by its client id; reached only by the tasks `listFavorites`, `addFavorite` and
// `removeFavorite`. Lost when the server restarts or sleeps: there is no database yet. It lives on `globalThis`, so
// the server keeps one store however its modules are loaded. `Map`s, not plain objects: a plain object walks number
// keys in ascending order, not in the order added, and a client id such as «constructor» is not found on its
// prototype.
globalStore.favoritesStore ??= new Map<string, ClientFavorites>();
export const favoritesStore = globalStore.favoritesStore;
