import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/routes/favorites/_stores/favoritesStore/favoritesStore";

// The favorites of one browser, the newest first.
export const listFavorites = async (clientId: string): Promise<Favorite[]> => {
    const favorites = await favoritesStore.list(clientId);
    return favorites.sort((a, b) => b.addedAt - a.addedAt);
};
