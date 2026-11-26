import { z } from "zod";
import { wholeNumberTextSchema } from "@tv-shows-explorer/shared";

// The path of one favorite, `/api/favorites/:id`: the id of a show, a whole number from 1.
export const favoriteParamsSchema = z.object({
    id: wholeNumberTextSchema,
});
