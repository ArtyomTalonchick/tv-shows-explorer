import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/routes/favorites/stores/favoritesStore";

// The favorites of one browser, the newest first; every favorites route answers them. Async like the other
// favorites tasks, so a database can replace the store without changing their callers.
export const listFavorites = async (clientId: string): Promise<Favorite[]> => {
    const favorites = favoritesStore.get(clientId);
    if (favorites === undefined) {
        return [];
    }

    return [...favorites.values()].sort((a, b) => b.addedAt - a.addedAt);
};
