import { z } from "zod";

// The optional body of `PUT /api/favorites/:id`. `addedAt` puts a removed show back in its place (Undo); without
// it the show is added now, at the top of the list.
export const addFavoriteBodySchema = z.object({
    addedAt: z.int().positive().optional(),
});

export type AddFavoriteBody = z.infer<typeof addFavoriteBodySchema>;
