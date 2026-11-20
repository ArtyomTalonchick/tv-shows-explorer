import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { toggleFavorite } from "../_tasks/toggleFavorite";
import { showFavoriteToast } from "./showFavoriteToast";
import { undo } from "./undo";

// A press on the bookmark of one show. It changes at once, and so do the counter and the list: the task changes the
// store before its request, and puts it back if the request fails. The toast says what was done at once, and what
// failed once the server answers. `saved` only chooses the toast; the task decides by the store whether to add or to
// remove. Calls a task, which the plugin's rules leave to a Presenter: see `architecture-exceptions.md`.
export const toggle = async (show: Omit<Show, "rating">, saved: Favorite | null): Promise<void> => {
    if (saved === null) {
        showFavoriteToast({ change: "added", name: show.name });
    } else {
        showFavoriteToast({ change: "removed", name: show.name, onUndo: () => void undo(saved) });
    }
    try {
        await toggleFavorite(show);
    } catch {
        showFavoriteToast({ change: saved === null ? "notAdded" : "notRemoved", name: show.name });
    }
};
