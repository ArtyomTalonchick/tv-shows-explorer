import { sendFavoritesRequest } from "./sendFavoritesRequest/sendFavoritesRequest";

// Loads the browser's favorites into the store. Its first argument only names the moment: `useRequest` passes the
// params it runs with.
export const loadFavorites = async (_when: "start", signal: AbortSignal): Promise<void> => {
    await sendFavoritesRequest({ method: "GET", signal });
};
