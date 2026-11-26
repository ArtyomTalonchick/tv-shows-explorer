import { z } from "zod";

// The body of `POST /api/session` (sign in): any email and password. The rule of `credentialsSchema` is not applied,
// so an account made by an older rule can still sign in.
export const signInBodySchema = z.object({
    email: z.string(),
    password: z.string(),
});

export type Credentials = z.infer<typeof signInBodySchema>;
