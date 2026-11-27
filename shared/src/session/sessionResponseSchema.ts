import type { z } from "zod";
import { sessionTokensSchema } from "./sessionTokensSchema";
import { userSchema } from "./userSchema";

// The answer of `POST /api/users` (sign up) and `POST /api/session` (sign in): a pair of tokens and the user they
// name. `GET /api/session` answers only the `User` of the access token. There is no sign-out request: the client
// drops its tokens.
export const sessionResponseSchema = sessionTokensSchema.extend({
    user: userSchema,
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
