import { favoriteParamsSchema } from "@tv-shows-explorer/shared";
import type { MiddlewareHandler } from "hono";
import { answerInvalid } from "~/lib/validation/answerInvalid";
import type { FavoriteEnv } from "~/routes/favorites/types";

// Lets a request of one favorite through only with a show id in its path (`favoriteParamsSchema`), and passes the id
// on to the handlers as `context.var.showId`; otherwise answers 400 from `answerInvalid`.
export const requireShowId: MiddlewareHandler<FavoriteEnv, "/:id"> = async (context, next) => {
    const result = favoriteParamsSchema.safeParse(context.req.param());
    if (!result.success) {
        return answerInvalid(result, context);
    }
    context.set("showId", result.data.id);
    await next();
};
