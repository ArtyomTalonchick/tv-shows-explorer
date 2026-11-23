import type { Handler } from "hono";
import { parseRefreshToken } from "./_logic/parseRefreshToken";
import { refreshSession } from "./_logic/_tasks/refreshSession";

// `POST /api/session/refresh` with a `RefreshBody`: a new pair of tokens for a valid refresh token, answering 200 with
// a `SessionResponse`. 400 when the body is not JSON with a string `refreshToken`; 401 for a broken, expired or
// foreign refresh token, an access token in its place, or the token of an account that is gone.
export const postSessionRefresh: Handler = async (context) => {
    const refreshToken = parseRefreshToken(await context.req.text());
    if (refreshToken === null) {
        return context.json({ error: "Expected a JSON body with a refreshToken" }, 400);
    }

    const session = await refreshSession(refreshToken);
    if (session === null) {
        return context.json({ error: "Sign in again: the refresh token is not valid" }, 401);
    }
    return context.json(session, 200);
};
