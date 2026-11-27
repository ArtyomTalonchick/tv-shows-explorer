import { z } from "zod";
import { wholeNumberTextSchema } from "../primitives/wholeNumberTextSchema";

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
