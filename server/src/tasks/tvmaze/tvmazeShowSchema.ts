import { z } from "zod";

// The fields of a TVmaze show the app reads: https://www.tvmaze.com/api#show-main-information. An answer without
// them, or with another type in one, is not taken; the fields the app does not read are dropped.
export const tvmazeShowSchema = z.object({
    id: z.int(),
    name: z.string(),
    genres: z.array(z.string()),
    rating: z.object({ average: z.number().nullable() }).nullable(),
    premiered: z.string().nullable(),
    ended: z.string().nullable(),
    image: z.object({ medium: z.string(), original: z.string() }).nullable(),
    url: z.string(),
});
