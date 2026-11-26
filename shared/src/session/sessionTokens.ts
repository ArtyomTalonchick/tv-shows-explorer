import { z } from "zod";

// The pair of tokens of a signed-in user.
export const sessionTokensSchema = z.object({
    // A JWT for the next requests, sent as `Authorization: Bearer <token>`, valid for 1 minute.
    accessToken: z.string(),
    // A JWT valid for 30 days, sent only to get a new pair once the access token runs out. Nothing opens with it.
    refreshToken: z.string(),
});

export type SessionTokens = z.infer<typeof sessionTokensSchema>;
