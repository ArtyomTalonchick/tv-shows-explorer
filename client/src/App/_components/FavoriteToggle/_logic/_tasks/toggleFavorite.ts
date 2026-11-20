import type { Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { addFavorite } from "./addFavorite";
import { removeFavorite } from "./removeFavorite";

// Removes the show from the favorites when it is there, and adds it otherwise. Rejects as `addFavorite` and
// `removeFavorite` do, once the change is rolled back.
export const toggleFavorite = async (show: Omit<Show, "rating">): Promise<void> => {
    const saved = useFavoritesStore.getState().favorites.find(({ id }) => id === show.id);
    if (saved === undefined) {
        await addFavorite(show);
        return;
    }
    await removeFavorite(saved);
};
