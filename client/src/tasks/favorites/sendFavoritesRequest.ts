import type { AddFavoriteBody } from "@tv-shows-explorer/shared";
import { fetchJson } from "~/lib/http/fetchJson";
import { API_URL } from "~/tasks/constants";
import { getClientId } from "./getClientId";

type FavoritesRequest = {
    method: "GET" | "PUT" | "DELETE";
    // The show of `PUT` and `DELETE`; `GET` asks for the whole list.
    id?: number;
    body?: AddFavoriteBody;
    signal?: AbortSignal;
};

// Sends a request of `/api/favorites` as this browser and returns the answer: the whole list (`Favorite[]`) to `GET`,
// the added `Favorite` to `PUT`, nothing to `DELETE`. The caller keeps it. Rejects on a network error or a non-2xx
// answer.
export const sendFavoritesRequest = async <T>({ method, id, body, signal }: FavoritesRequest): Promise<T> => {
    const url = id === undefined ? `${API_URL}/favorites` : `${API_URL}/favorites/${id}`;

    return await fetchJson<T>(url, { method, headers: { "X-Client-Id": getClientId() }, body, signal });
};
