import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { addFavorite } from "../_tasks/addFavorite";
import { toggleFavorite } from "../_tasks/toggleFavorite";
import { showFavoriteToast } from "./showFavoriteToast";

export type UseFavoriteToggleResult = {
    // The show is a favourite.
    pressed: boolean;
    // What a press does, for screen readers: «Add Dark to favourites».
    label: string;
    // Adds or removes the show, and says so in a toast.
    toggle: () => void;
};

// The bookmark of one show. It changes at once, and so do the counter and the list: the task changes the store
// before its request, and puts it back if the request fails. The toast says what was done at once, and what failed
// once the server answers.
export const useFavoriteToggle = (show: Omit<Show, "rating">): UseFavoriteToggleResult => {
    const saved = useFavoritesStore((state) => state.favorites.find((favorite) => favorite.id === show.id) ?? null);

    // Puts a removed show back in its old place.
    const undo = async (removed: Favorite): Promise<void> => {
        showFavoriteToast({ change: "added", name: removed.name });
        try {
            await addFavorite(removed, removed.addedAt);
        } catch {
            showFavoriteToast({ change: "notAdded", name: removed.name });
        }
    };

    // `saved` only chooses the toast; the task decides by the store whether to add or to remove.
    const toggle = async (removed: Favorite | null): Promise<void> => {
        if (removed === null) {
            showFavoriteToast({ change: "added", name: show.name });
        } else {
            showFavoriteToast({ change: "removed", name: show.name, onUndo: () => void undo(removed) });
        }
        try {
            await toggleFavorite(show);
        } catch {
            showFavoriteToast({ change: removed === null ? "notAdded" : "notRemoved", name: show.name });
        }
    };

    return {
        pressed: saved !== null,
        label: saved === null ? `Add ${show.name} to favourites` : `Remove ${show.name} from favourites`,
        toggle: () => void toggle(saved),
    };
};
