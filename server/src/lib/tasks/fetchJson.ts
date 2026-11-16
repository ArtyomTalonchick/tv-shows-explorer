// GETs `url` and parses the answer as JSON. Rejects on a network error, a non-2xx answer, or when `signal` aborts.
// The caller owns `signal`: one signal can cancel several requests or be combined with a timeout.
export const fetchJson = async <T>(url: string, signal: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};
