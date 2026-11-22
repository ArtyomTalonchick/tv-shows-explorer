import type { Favorite } from "@tv-shows-explorer/shared";
import { addFavorite } from "../_tasks/addFavorite";
import { showFavoriteToast } from "./showFavoriteToast";

// Undo in the toast of a removal: puts the removed show back in its old place, and says so; a failed request says
// that too.
export const undo = async (removed: Favorite): Promise<void> => {
    showFavoriteToast({ change: "added", name: removed.name });
    try {
        await addFavorite(removed, removed.addedAt);
    } catch {
        showFavoriteToast({ change: "notAdded", name: removed.name });
    }
};
