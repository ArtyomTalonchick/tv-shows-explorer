import { z } from "zod";
import { showSchema } from "../shows/show";

// Every request of `/api/favorites` sends the `X-Client-Id` header: a UUID the browser makes once
// (`crypto.randomUUID()`) and keeps, which names its own list of favorites.

// A show in the favorites: what the favorites list shows, so the list needs no TVmaze request, and when it was
// added (ms since the epoch). The list is sorted by it, the newest first. `GET /api/favorites` answers the list
// (`Favorite[]`), `PUT /api/favorites/:id` the one favorite it added or found, and `DELETE` answers 204 with no body.
export const favoriteSchema = showSchema.omit({ rating: true }).extend({
    addedAt: z.int(),
});

export type Favorite = z.infer<typeof favoriteSchema>;
