import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { useState } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { addFavorite } from "../_tasks/addFavorite";
import { removeFavorite } from "../_tasks/removeFavorite";
import { showFavoriteToast } from "./showFavoriteToast";

type FavoriteShow = Pick<Show, "id" | "name">;

export type UseFavoriteToggleResult = {
    // The show is a favourite.
    pressed: boolean;
    // Its change is on the way.
    busy: boolean;
    // What a press does, for screen readers: «Add Dark to favourites».
    label: string;
    // Adds or removes the show, and says so in a toast.
    toggle: () => void;
};

// The bookmark of one show. It changes when the server answers, not before: the server answers the whole list, so the
// bookmarks, the counter and the list always show the same list, and a failed request leaves them as they were.
export const useFavoriteToggle = (show: FavoriteShow): UseFavoriteToggleResult => {
    const saved = useFavoritesStore((state) => state.favorites.find((favorite) => favorite.id === show.id) ?? null);
    const [busy, setBusy] = useState(false);

    const whileBusy = async (send: () => Promise<void>): Promise<void> => {
        setBusy(true);
        try {
            await send();
        } finally {
            setBusy(false);
        }
    };

    // `addedAt` is given by Undo: the show goes back to its old place.
    const add = async (added: FavoriteShow, addedAt?: number): Promise<void> => {
        try {
            await addFavorite(added.id, addedAt);
            showFavoriteToast({ change: "added", name: added.name });
        } catch {
            showFavoriteToast({ change: "notAdded", name: added.name });
        }
    };

    const remove = async (removed: Favorite): Promise<void> => {
        try {
            await removeFavorite(removed.id);
            const undo = (): void => {
                void whileBusy(() => add(removed, removed.addedAt));
            };
            showFavoriteToast({ change: "removed", name: removed.name, onUndo: undo });
        } catch {
            showFavoriteToast({ change: "notRemoved", name: removed.name });
        }
    };

    const toggle = (): void => {
        void whileBusy(() => (saved === null ? add(show) : remove(saved)));
    };

    return {
        pressed: saved !== null,
        busy,
        label: saved === null ? `Add ${show.name} to favourites` : `Remove ${show.name} from favourites`,
        toggle,
    };
};
