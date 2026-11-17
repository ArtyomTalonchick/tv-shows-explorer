// Sends a request to `url` and parses the answer as JSON. Rejects on a network error, a non-2xx answer, or when
// `init.signal` aborts. The caller owns the signal: one signal can cancel several requests or be combined with a
// timeout.
export const fetchJson = async <T>(url: string, init: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
};
