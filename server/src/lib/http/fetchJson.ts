import { HttpError } from "../errors/HttpError";

// GETs `url` and parses the answer as JSON. Rejects on a network error, when `signal` aborts, and with an `HttpError`
// on a non-2xx answer. The caller owns `signal`: one signal can cancel several requests or be combined with a timeout.
export const fetchJson = async <T>(url: string, signal: AbortSignal): Promise<T> => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new HttpError(response.status);
    }

    return (await response.json()) as T;
};
