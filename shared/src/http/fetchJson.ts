import type { z } from "zod";
import { HttpError } from "./HttpError";

// The options of a request, with the body as a value: it is sent as JSON.
export type JsonRequestInit = Omit<RequestInit, "body"> & { body?: unknown };

// Sends a request to `url` and answers its JSON as `schema` reads it; a 204 answer has no body, so its schema reads
// `undefined` (`z.undefined()`). A `body` goes as JSON, with its `Content-Type` next to the caller's headers. Rejects
// on a network error, on a non-2xx answer with an `HttpError` that holds its status, on an answer `schema` refuses
// (a `ZodError`), or when `init.signal` aborts. The caller owns the signal: one signal can cancel several requests or
// be combined with a timeout.
export const fetchJson = async <S extends z.ZodType>(
    url: string,
    schema: S,
    { body, ...init }: JsonRequestInit = {},
): Promise<z.output<S>> => {
    const request = ((): RequestInit => {
        if (body === undefined) {
            return init;
        }
        const headers = new Headers(init.headers);
        headers.set("Content-Type", "application/json");
        return { ...init, headers, body: JSON.stringify(body) };
    })();

    const response = await fetch(url, request);
    if (!response.ok) {
        throw new HttpError(response.status);
    }
    if (response.status === 204) {
        return schema.parse(undefined);
    }

    return schema.parse(await response.json());
};
