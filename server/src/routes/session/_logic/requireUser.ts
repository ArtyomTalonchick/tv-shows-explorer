import type { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";
import type { SessionEnv } from "~/routes/session/types";
import { readJwtSecret } from "~/tasks/readJwtSecret";

const BEARER = "Bearer ";

// Lets a request through only with a token of this server in `Authorization: Bearer <token>`, signed with HS256 and
// not expired, and passes its user id (`sub`) on to the handlers as `context.var.userId`; otherwise answers 401.
export const requireUser: MiddlewareHandler<SessionEnv> = async (context, next) => {
    const header = context.req.header("Authorization") ?? "";
    const secret = readJwtSecret();
    const userId = await (async (): Promise<string | null> => {
        if (!header.startsWith(BEARER)) {
            return null;
        }
        try {
            const payload = await verify(header.slice(BEARER.length), secret, "HS256");
            return typeof payload.sub === "string" ? payload.sub : null;
        } catch {
            return null;
        }
    })();
    if (userId === null) {
        return context.json({ error: "Sign in first: expected a valid token in Authorization: Bearer" }, 401);
    }
    context.set("userId", userId);
    await next();
};
