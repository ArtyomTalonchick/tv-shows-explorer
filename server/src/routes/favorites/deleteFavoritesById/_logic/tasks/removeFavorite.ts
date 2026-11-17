import { favoritesStore } from "@/routes/favorites/_stores/favoritesStore";

// Removes the show from the favorites of one browser; a show that is not there changes nothing. A browser left
// with no favorites is dropped from the store.
export const removeFavorite = async (clientId: string, id: number): Promise<void> => {
    const favorites = favoritesStore.get(clientId);
    favorites?.delete(id);
    if (favorites?.size === 0) {
        favoritesStore.delete(clientId);
    }
};
