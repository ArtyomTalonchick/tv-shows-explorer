import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "~/routes/favorites/_stores/favoritesStore/favoritesStore";

// The favorites of one user, the newest first.
export const listFavorites = async (userId: string): Promise<Favorite[]> => {
    const favorites = await favoritesStore.list(userId);
    return favorites.sort((a, b) => b.addedAt - a.addedAt);
};
