import type { MiddlewareHandler } from "hono";
import type { FavoriteEnv } from "~/routes/favorites/types";
import { parseShowId } from "./parseShowId";

// Lets a request of one favorite through only with a show id in its path, and passes the id on to the handlers as
// `context.var.showId`; otherwise answers 400.
export const requireShowId: MiddlewareHandler<FavoriteEnv, "/:id"> = async (context, next) => {
    const showId = parseShowId(context.req.param("id"));
    if (showId === null) {
        return context.json({ error: "Expected a show id from 1" }, 400);
    }
    context.set("showId", showId);
    await next();
};
