import type { MiddlewareHandler } from "hono";
import type { SessionEnv } from "~/routes/session/types";
import { verifyToken } from "~/tasks/session/jwt/verifyToken";

const BEARER = "Bearer ";

// Lets a request through only with an access token of this server in `Authorization: Bearer <token>`
// (`verifyToken`), so a refresh token does not open the routes. Passes its user id on to the handlers as
// `context.var.userId`; otherwise answers 401.
export const requireUser: MiddlewareHandler<SessionEnv> = async (context, next) => {
    const header = context.req.header("Authorization") ?? "";
    const token = header.startsWith(BEARER) ? header.slice(BEARER.length) : "";
    const userId = await verifyToken(token, "access");
    if (userId === null) {
        return context.json({ error: "Sign in first: expected a valid token in Authorization: Bearer" }, 401);
    }
    context.set("userId", userId);
    await next();
};
