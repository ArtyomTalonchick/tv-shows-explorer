import { z } from "zod";

// The shortest password an account takes; the sign-up form names it in its hint.
export const PASSWORD_MIN_LENGTH = 8;

// The rule of valid credentials, the body of `POST /api/users` (sign up): an email, checked without its outer spaces,
// and a password of `PASSWORD_MIN_LENGTH` characters or more, taken as typed: spaces count. The client checks its
// forms and the server a sign-up by this one schema, so the two cannot disagree; the server keeps and compares the
// email by its `normalizeEmail`.
export const credentialsSchema = z.object({
    email: z.string().trim().pipe(z.email()),
    password: z.string().min(PASSWORD_MIN_LENGTH),
});

export type Credentials = z.infer<typeof credentialsSchema>;
