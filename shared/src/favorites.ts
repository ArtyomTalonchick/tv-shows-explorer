import type { Show } from "./show";

// Every request of `/api/favorites` sends the `X-Client-Id` header: a UUID the browser makes once
// (`crypto.randomUUID()`) and keeps, which names its own list of favorites.

// A show in the favorites: what the favorites list shows, so the list needs no TVmaze request, and when it was
// added (ms since the epoch). The list is sorted by it, the newest first. `GET /api/favorites` answers the list
// (`Favorite[]`), `PUT /api/favorites/:id` the one favorite it added or found, and `DELETE` answers 204 with no body.
export type Favorite = Omit<Show, "rating"> & {
    addedAt: number;
};

// The optional body of `PUT /api/favorites/:id`. `addedAt` puts a removed show back in its place (Undo); without
// it the show is added now, at the top of the list.
export type AddFavoriteBody = {
    addedAt?: number;
};
