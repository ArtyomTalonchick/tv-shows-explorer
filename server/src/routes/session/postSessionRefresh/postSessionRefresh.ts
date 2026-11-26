import { refreshBodySchema } from "@tv-shows-explorer/shared";
import { withValid } from "~/lib/validation/withValid";
import { refreshSession } from "./_logic/_tasks/refreshSession";

// `POST /api/session/refresh` with a `RefreshBody`: a new pair of tokens for a valid refresh token, answering 200 with
// a `SessionResponse`. 400 when the body is not JSON of a `refreshBodySchema`; 401 for a broken, expired or foreign
// refresh token, an access token in its place, or the token of an account that is gone.
export const postSessionRefresh = withValid({ json: refreshBodySchema }, async (context, { json }) => {
    const session = await refreshSession(json.refreshToken);
    if (session === null) {
        return context.json({ error: "Sign in again: the refresh token is not valid" }, 401);
    }
    return context.json(session, 200);
});
