import { z } from "zod";

// A whole number from 1 written as text, without a sign, a fraction or leading zeros, read as a number. A part of the
// schemas of other subjects: the page of `showsQuerySchema`, the show id of `favoriteParamsSchema`.
export const wholeNumberTextSchema = z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.int());
