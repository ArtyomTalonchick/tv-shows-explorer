import { z } from "zod";
import { genreCountSchema } from "./genreCountSchema";
import { showSchema } from "./showSchema";

// The answer of `GET /api/shows`: one page of the found shows of a genre, and what the filter and the pages need.
export const showsPageSchema = z.object({
    shows: z.array(showSchema),
    // The genres of all the found shows, the most common first, a tie in alphabetical order.
    genres: z.array(genreCountSchema),
    // The number of all the found shows.
    found: z.int(),
    // The genre the shows were filtered by.
    genre: z.string().nullable(),
    // The number of the found shows of that genre, over all the pages.
    total: z.int(),
    // The page given; a page past the last one gives the last.
    page: z.int(),
    perPage: z.int(),
});

export type ShowsPage = z.infer<typeof showsPageSchema>;
