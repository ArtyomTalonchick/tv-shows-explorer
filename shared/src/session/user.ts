import { z } from "zod";

// A user as the API shows it: never the password or its hash.
export const userSchema = z.object({
    id: z.string(),
    email: z.string(),
});

export type User = z.infer<typeof userSchema>;
