import type { Favorite } from "@tv-shows-explorer/shared";
import type { FavoritesStore } from "./types";

// One browser's favorites by show id.
type ClientFavorites = Map<number, Favorite>;

const globalStore = globalThis as typeof globalThis & { favoritesStore?: Map<string, ClientFavorites> };

// The favorites kept in the server's memory, by the client id of each browser: lost when the server restarts or
// sleeps. It lives on `globalThis`, so the server keeps one store however its modules are loaded. `Map`s, not plain
// objects: a plain object walks number keys in ascending order, not in the order added, and a client id such as
// «constructor» is not found on its prototype.
export const createMemoryStore = (): FavoritesStore => {
    globalStore.favoritesStore ??= new Map<string, ClientFavorites>();
    const clients = globalStore.favoritesStore;

    return {
        list: async (clientId) => {
            return [...(clients.get(clientId)?.values() ?? [])];
        },
        get: async (clientId, id) => {
            return clients.get(clientId)?.get(id) ?? null;
        },
        put: async (clientId, favorite) => {
            const favorites = clients.get(clientId) ?? new Map<number, Favorite>();
            favorites.set(favorite.id, favorite);
            clients.set(clientId, favorites);
        },
        // A browser left with no favorites is dropped from the store.
        remove: async (clientId, id) => {
            const favorites = clients.get(clientId);
            favorites?.delete(id);
            if (favorites?.size === 0) {
                clients.delete(clientId);
            }
        },
        clear: async () => {
            clients.clear();
        },
    };
};
