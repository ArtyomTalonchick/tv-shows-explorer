import type { AddFavoriteBody } from "@tv-shows-explorer/shared";
import { API_URL } from "~/tasks/constants";
import { fetchAsUser } from "~/tasks/session/fetchAsUser/fetchAsUser";

type FavoritesRequest = {
    method: "GET" | "PUT" | "DELETE";
    // The show of `PUT` and `DELETE`; `GET` asks for the whole list.
    id?: number;
    body?: AddFavoriteBody;
    signal?: AbortSignal;
};

// Sends a request of `/api/favorites` as the signed-in user (`fetchAsUser`) and returns the answer: the whole list
// (`Favorite[]`) to `GET`, the added `Favorite` to `PUT`, nothing to `DELETE`. The caller keeps it. Rejects on a
// network error or a non-2xx answer, a 401 included when the session cannot be refreshed.
export const sendFavoritesRequest = async <T>({ method, id, body, signal }: FavoritesRequest): Promise<T> => {
    const url = id === undefined ? `${API_URL}/favorites` : `${API_URL}/favorites/${id}`;

    return await fetchAsUser<T>(url, { method, body, signal });
};
