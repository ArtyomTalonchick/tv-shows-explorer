import { favoritesStore } from "@/stores/favoritesStore/favoritesStore";

// Removes the show from the favorites of one browser; a show that is not there changes nothing.
export const removeFavorite = async (clientId: string, id: number): Promise<void> => {
    await favoritesStore.remove(clientId, id);
};
