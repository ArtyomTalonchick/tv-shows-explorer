import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { useState } from "react";
import type { FavoriteToggleProps } from "@/_components/FavoriteToggle/FavoriteToggle";
import { addFavorite } from "@/_logic/_tasks/addFavorite";
import { removeFavorite } from "@/_logic/_tasks/removeFavorite";
import { useFavoritesStore } from "@/_stores/useFavoritesStore";
import { showFavoriteToast } from "./showFavoriteToast";

type FavoriteShow = Pick<Show, "id" | "name">;

export type UseFavoriteToggleResult = {
    // The bookmark of a show: pressed while it is a favourite, busy while its change is on the way. A press adds or
    // removes the show and says so in a toast.
    toggleFor: (show: FavoriteShow) => Omit<FavoriteToggleProps, "variant">;
};

// The bookmark changes when the server answers, not before: the server answers the whole list, so the bookmarks, the
// counter and the list always show the same list, and a failed request leaves them as they were.
export const useFavoriteToggle = (): UseFavoriteToggleResult => {
    const favorites = useFavoritesStore((state) => state.favorites);
    const [pendingIds, setPendingIds] = useState<number[]>([]);

    const whileBusy = async (id: number, send: () => Promise<void>): Promise<void> => {
        setPendingIds((ids) => [...ids, id]);
        try {
            await send();
        } finally {
            setPendingIds((ids) => ids.filter((pending) => pending !== id));
        }
    };

    // `addedAt` is given by Undo: the show goes back to its old place.
    const add = async (show: FavoriteShow, addedAt?: number): Promise<void> => {
        try {
            await addFavorite(show.id, addedAt);
            showFavoriteToast({ change: "added", name: show.name });
        } catch {
            showFavoriteToast({ change: "notAdded", name: show.name });
        }
    };

    const remove = async (saved: Favorite): Promise<void> => {
        try {
            await removeFavorite(saved.id);
            const undo = (): void => {
                void whileBusy(saved.id, () => add(saved, saved.addedAt));
            };
            showFavoriteToast({ change: "removed", name: saved.name, onUndo: undo });
        } catch {
            showFavoriteToast({ change: "notRemoved", name: saved.name });
        }
    };

    const toggleFor = (show: FavoriteShow): Omit<FavoriteToggleProps, "variant"> => {
        const saved = favorites.find((favorite) => favorite.id === show.id) ?? null;
        const send = (): Promise<void> => (saved === null ? add(show) : remove(saved));

        return {
            pressed: saved !== null,
            busy: pendingIds.includes(show.id),
            label: saved === null ? `Add ${show.name} to favourites` : `Remove ${show.name} from favourites`,
            onClick: () => void whileBusy(show.id, send),
        };
    };

    return { toggleFor };
};
