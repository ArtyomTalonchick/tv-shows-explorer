import type { Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import type { FavoriteTogglePlace } from "../../FavoriteToggle";
import { toggleFavorite } from "../_tasks/toggleFavorite";
import { showFavoriteToast } from "./showFavoriteToast";

// A press on the bookmark of one show. It changes at once, and so do the counter and the list: the task changes the
// store before its request, and puts it back if the request fails. The toast says what was done at once, and what
// failed once the server answers; it reads the show from the store at the moment of the press, as the task does, so
// the two agree. In the favourites list the row itself says what was done, so only a failure has a toast. A guest's
// press changes nothing, and the toast offers to sign in.
export const toggle = async (show: Omit<Show, "rating">, place: FavoriteTogglePlace = "card"): Promise<void> => {
    const saved = useFavoritesStore.getState().findFavorite(show.id);
    const { isGuest, request } = toggleFavorite(show);
    if (isGuest) {
        showFavoriteToast({ change: "signInFirst", name: show.name });
        return;
    }
    if (place === "card") {
        showFavoriteToast({ change: saved === null ? "added" : "removed", name: show.name });
    }
    try {
        await request;
    } catch {
        showFavoriteToast({ change: saved === null ? "notAdded" : "notRemoved", name: show.name });
    }
};
