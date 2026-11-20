import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { sendFavoritesRequest } from "@/tasks/favorites/sendFavoritesRequest";

// Loads the browser's favorites into the store. Rejects as `sendFavoritesRequest` does, and when `signal` aborts; the
// store then stays as it was.
export const loadFavorites = async (signal?: AbortSignal): Promise<void> => {
    const favorites = await sendFavoritesRequest<Favorite[]>({ method: "GET", signal });
    useFavoritesStore.setState({ favorites });
};
