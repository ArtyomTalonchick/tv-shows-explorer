import type { ZodType } from "zod";
import { HttpError } from "../errors/HttpError";

// GETs `url` and parses the answer as JSON of `schema`. Rejects on a network error, when `signal` aborts, with an
// `HttpError` on a non-2xx answer, and with a `ZodError` on an answer of another shape. The caller owns `signal`: one
// signal can cancel several requests or be combined with a timeout.
export const fetchJson = async <T>(url: string, schema: ZodType<T>, signal: AbortSignal): Promise<T> => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new HttpError(response.status);
    }

    return schema.parse(await response.json());
};
