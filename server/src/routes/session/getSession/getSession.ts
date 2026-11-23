import type { Handler } from "hono";
import type { SessionEnv } from "~/routes/session/types";
import { loadUser } from "./_logic/_tasks/loadUser";

// `GET /api/session`: the `User` of the token `requireUser` checked. 401 when the token names an account that is gone.
export const getSession: Handler<SessionEnv> = async (context) => {
    const user = await loadUser(context.var.userId);
    if (user === null) {
        return context.json({ error: "The account of this token is gone" }, 401);
    }
    return context.json(user, 200);
};
