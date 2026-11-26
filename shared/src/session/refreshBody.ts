import { z } from "zod";

// The body of `POST /api/session/refresh`: the refresh token to exchange for a new `SessionResponse`.
export const refreshBodySchema = z.object({
    refreshToken: z.string(),
});

export type RefreshBody = z.infer<typeof refreshBodySchema>;
