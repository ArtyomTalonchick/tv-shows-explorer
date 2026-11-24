import { favoritesStore } from "~/routes/favorites/_stores/favoritesStore/favoritesStore";

// Removes the show from the favorites of one user; a show that is not there changes nothing.
export const removeFavorite = async (userId: string, id: number): Promise<void> => {
    await favoritesStore.remove(userId, id);
};
