import { zValidator } from "@hono/zod-validator";
import type { Context, Env, Handler, MiddlewareHandler } from "hono";
import { every } from "hono/combine";
import type { z } from "zod";
import { answerInvalid } from "./answerInvalid";

// The parts of a request a schema can check: the JSON body, the query and the path.
type Target = "json" | "query" | "param";

// The schemas of a request, by the part each one checks.
type Schemas = Partial<Record<Target, z.ZodType>>;

// What the handler gets: the checked value of each part, by the same names.
type Valid<S extends Schemas> = { [K in keyof S]: z.output<NonNullable<S[K]>> };

// The handlers of a route whose request is checked by schemas, by part (`{ param: …, json: … }`, at least one): 400
// from `answerInvalid` to the first part its schema refuses, otherwise `handler` with the checked values by the same
// names (`{ param, json }`). The route table spreads them: `.put("/:id", ...putFavoritesById)`.
export const withValid = <S extends Schemas, E extends Env = Env, P extends string = string>(
    schemas: S & (keyof S extends never ? never : unknown),
    handler: (context: Context<E, P>, valid: Valid<S>) => Promise<Response>,
): [MiddlewareHandler<E, P>, Handler<E, P>] => {
    const parts = Object.entries(schemas) as [Target, z.ZodType][];

    const validate: MiddlewareHandler<E, P> = every(
        ...parts.map(([target, schema]) => zValidator(target, schema, answerInvalid)),
    );
    const handle: Handler<E, P> = async (context) => {
        // The validators above have checked these parts; Hono's types cannot follow parts chosen at run.
        const valid = Object.fromEntries(
            parts.map(([target]) => [target, context.req.valid(target as never) as unknown]),
        );
        return await handler(context, valid as Valid<S>);
    };
    return [validate, handle];
};
