import { sendFavoritesRequest } from "@/tasks/favorites/sendFavoritesRequest/sendFavoritesRequest";

// Loads the browser's favorites into the store. Rejects as `sendFavoritesRequest` does, and when `signal` aborts.
export const loadFavorites = async (signal?: AbortSignal): Promise<void> => {
    await sendFavoritesRequest({ method: "GET", signal });
};
