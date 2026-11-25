import { z } from "zod";

// A user as the API shows it: never the password or its hash.
export const userSchema = z.object({
    id: z.string(),
    email: z.string(),
});

export type User = z.infer<typeof userSchema>;

// The pair of tokens of a signed-in user.
export const sessionTokensSchema = z.object({
    // A JWT for the next requests, sent as `Authorization: Bearer <token>`, valid for 1 minute.
    accessToken: z.string(),
    // A JWT valid for 30 days, sent only to get a new pair once the access token runs out. Nothing opens with it.
    refreshToken: z.string(),
});

export type SessionTokens = z.infer<typeof sessionTokensSchema>;

// The answer of `POST /api/users` (sign up) and `POST /api/session` (sign in): a pair of tokens and the user they
// name. `GET /api/session` answers only the `User` of the access token. There is no sign-out request: the client
// drops its tokens.
export const sessionResponseSchema = sessionTokensSchema.extend({
    user: userSchema,
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;

// The body of `POST /api/session/refresh`: the refresh token to exchange for a new `SessionResponse`.
export const refreshBodySchema = z.object({
    refreshToken: z.string(),
});

export type RefreshBody = z.infer<typeof refreshBodySchema>;
