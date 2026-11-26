import type { Context } from "hono";
import { z } from "zod";

// What a validator middleware found: the value is valid, or the error of its schema.
type ValidationResult = { success: true } | { success: false; error: z.core.$ZodError };

// The hook of a Zod validator middleware (`zValidator(target, schema, answerInvalid)`): answers 400 with what is
// wrong, `{ error }` in Zod's words, to a value its schema refuses, and lets a valid one through to the handler.
export const answerInvalid = (result: ValidationResult, context: Context): Response | undefined => {
    if (result.success) {
        return undefined;
    }
    return context.json({ error: z.prettifyError(result.error) }, 400);
};
