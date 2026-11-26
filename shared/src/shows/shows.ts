import { z } from "zod";
import { wholeNumberTextSchema } from "../primitives/wholeNumberText";
import { showSchema } from "./show";

// A genre of the found shows and the number of them that have it.
const genreCountSchema = z.object({
    genre: z.string(),
    count: z.int(),
});

export type GenreCount = z.infer<typeof genreCountSchema>;

// What `GET /api/shows` is asked, `?q=<query>&genre=<genre>&page=<page>`, read as a `ShowsQuery`. The query is
// trimmed and not empty; no genre, or an empty one, means all the shows; pages count from 1, and none means the first.
export const showsQuerySchema = z
    .object({
        q: z.string().trim().min(1),
        genre: z
            .string()
            .optional()
            .transform((genre): string | null => (genre === undefined || genre === "" ? null : genre)),
        page: wholeNumberTextSchema.default(1),
    })
    .transform(({ q, genre, page }) => ({ query: q, genre, page }));

export type ShowsQuery = z.output<typeof showsQuerySchema>;

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
