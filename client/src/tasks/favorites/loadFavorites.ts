import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { sendFavoritesRequest } from "./sendFavoritesRequest";

// Loads the signed-in user's favorites into the store; a guest has none, and nothing is asked. Rejects as
// `sendFavoritesRequest` does, and when `signal` aborts; the store then stays as it was.
export const loadFavorites = async (signal?: AbortSignal): Promise<void> => {
    if (useSessionStore.getState().session === null) {
        useFavoritesStore.setState({ favorites: [] });
        return;
    }

    const favorites = await sendFavoritesRequest<Favorite[]>({ method: "GET", signal });
    useFavoritesStore.setState({ favorites });
};
