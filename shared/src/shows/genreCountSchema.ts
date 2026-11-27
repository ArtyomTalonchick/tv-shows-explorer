import { z } from "zod";

// A genre of the found shows and the number of them that have it.
export const genreCountSchema = z.object({
    genre: z.string(),
    count: z.int(),
});

export type GenreCount = z.infer<typeof genreCountSchema>;
