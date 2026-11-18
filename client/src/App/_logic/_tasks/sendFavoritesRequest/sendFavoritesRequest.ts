import type { AddFavoriteBody, Favorite } from "@tv-shows-explorer/shared";
import { fetchJson } from "@/lib/http/fetchJson";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { getClientId } from "./getClientId";

type FavoritesRequest = {
    method: "GET" | "PUT" | "DELETE";
    // The show of `PUT` and `DELETE`; `GET` asks for the whole list.
    id?: number;
    body?: AddFavoriteBody;
    signal?: AbortSignal;
};

// Sends a request of `/api/favorites` as this browser and keeps the list the server answers, which is the whole list
// after any change. Rejects on a network error or a non-2xx answer, and the store stays as it was.
export const sendFavoritesRequest = async ({ method, id, body, signal }: FavoritesRequest): Promise<void> => {
    const url = id === undefined ? "/api/favorites" : `/api/favorites/${id}`;
    const headers: Record<string, string> = { "X-Client-Id": getClientId() };
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    const favorites = await fetchJson<Favorite[]>(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal,
    });
    useFavoritesStore.getState().setFavorites(favorites);
};
