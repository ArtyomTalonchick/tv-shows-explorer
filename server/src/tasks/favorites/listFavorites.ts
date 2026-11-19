import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/stores/favoritesStore/favoritesStore";

// The favorites of one browser, the newest first; every favorites route answers them.
export const listFavorites = async (clientId: string): Promise<Favorite[]> => {
    const favorites = await favoritesStore.list(clientId);
    return favorites.sort((a, b) => b.addedAt - a.addedAt);
};
