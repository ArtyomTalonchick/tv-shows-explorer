import { zValidator } from "@hono/zod-validator";
import type { Context, Env, Handler, MiddlewareHandler } from "hono";
import type { z } from "zod";
import { answerInvalid } from "./answerInvalid";

// The parts of a request a schema can check: the JSON body or the query.
type Target = "json" | "query";

// The handlers of a route whose request is checked by schemas, one per part (`{ json: credentialsSchema }`): 400
// from `answerInvalid` to a part its schema refuses, otherwise `handler` with the checked values by the same names
// (`{ json }`). The route table spreads them: `.post("/", ...postUsers)`. One part for now; a route that needs two
// widens this function, not its callers.
export const withValid = <T extends Target, S extends z.ZodType, E extends Env = Env, P extends string = string>(
    schemas: Record<T, S>,
    handler: (context: Context<E, P>, valid: Record<T, z.output<S>>) => Promise<Response>,
): [MiddlewareHandler<E, P>, Handler<E, P>] => {
    const targets = Object.keys(schemas) as T[];
    const [target] = targets;
    if (target === undefined || targets.length > 1) {
        throw new Error(`withValid checks one part of a request for now, got: ${targets.join(", ")}`);
    }

    const validate: MiddlewareHandler<E, P> = zValidator(target, schemas[target], answerInvalid);
    const handle: Handler<E, P> = async (context) => {
        // The validator above has checked this part by its schema; Hono's types cannot follow a target chosen at run.
        const value = context.req.valid(target as never) as z.output<S>;
        return await handler(context, { [target]: value } as Record<T, z.output<S>>);
    };
    return [validate, handle];
};
