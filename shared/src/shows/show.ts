import { z } from "zod";

// A show as the app uses it, mapped from a TVmaze search result.
export const showSchema = z.object({
    id: z.int(),
    name: z.string(),
    genres: z.array(z.string()),
    rating: z.number().nullable(),
    premiered: z.string().nullable(),
    ended: z.string().nullable(),
    image: z.string().nullable(),
    // The show's page on TVmaze.
    url: z.string(),
});

export type Show = z.infer<typeof showSchema>;
