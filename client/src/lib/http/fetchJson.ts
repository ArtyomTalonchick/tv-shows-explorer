import { HttpError } from "./HttpError";

// The options of a request, with the body as a value: it is sent as JSON.
export type JsonRequestInit = Omit<RequestInit, "body"> & { body?: unknown };

// Sends a request to `url` and parses the answer as JSON; a 204 answer has no body and resolves `undefined`, so its
// caller asks for `fetchJson<void>`. A `body` goes as JSON, with its `Content-Type` next to the caller's headers.
// Rejects on a network error, on a non-2xx answer with an `HttpError` that holds its status, or when `init.signal`
// aborts. The caller owns the signal: one signal can cancel several requests or be combined with a timeout.
export const fetchJson = async <T>(url: string, { body, ...init }: JsonRequestInit = {}): Promise<T> => {
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
        return undefined as T;
    }

    return (await response.json()) as T;
};
