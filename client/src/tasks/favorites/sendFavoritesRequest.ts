import type { AddFavoriteBody } from "@tv-shows-explorer/shared";
import type { z } from "zod";
import { API_URL } from "~/tasks/constants";
import { fetchAsUser } from "~/tasks/session/fetchAsUser/fetchAsUser";

type FavoritesRequest = {
    method: "GET" | "PUT" | "DELETE";
    // The show of `PUT` and `DELETE`; `GET` asks for the whole list.
    id?: number;
    body?: AddFavoriteBody;
    signal?: AbortSignal;
};

// Sends a request of `/api/favorites` as the signed-in user (`fetchAsUser`) and returns the answer as `schema` reads
// it: the whole list (`Favorite[]`) to `GET`, the added `Favorite` to `PUT`, nothing to `DELETE`. The caller keeps
// it. Rejects on a network error, a non-2xx answer, a 401 included when the session cannot be refreshed, or an
// answer of a wrong shape.
export const sendFavoritesRequest = async <S extends z.ZodType>(
    { method, id, body, signal }: FavoritesRequest,
    schema: S,
): Promise<z.output<S>> => {
    const url = id === undefined ? `${API_URL}/favorites` : `${API_URL}/favorites/${id}`;

    return await fetchAsUser(url, schema, { method, body, signal });
};
