import type { MiddlewareHandler } from "hono";
import type { FavoritesEnv } from "~/routes/favorites/types";
import { parseClientId } from "./parseClientId";

// Lets a favorites request through only with a UUID in its `X-Client-Id` header, and passes the id on to the
// handlers as `context.var.clientId`; otherwise answers 400.
export const requireClientId: MiddlewareHandler<FavoritesEnv> = async (context, next) => {
    const clientId = parseClientId(context.req.header("X-Client-Id"));
    if (clientId === null) {
        return context.json({ error: "Expected a UUID in the X-Client-Id header" }, 400);
    }
    context.set("clientId", clientId);
    await next();
};
