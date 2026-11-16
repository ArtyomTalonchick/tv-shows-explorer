import { useEffect, useState } from "react";

// The answer to one request: the data, or `failed` and no data. `params` and `attempt` name the request it answers.
export type RequestAnswer<P, T> = {
  params: P;
  attempt: number;
  data: T | null;
  failed: boolean;
};

export type UseRequestResult<P, T> = {
  // The last answer, to these params or to earlier ones.
  latest: RequestAnswer<P, T> | null;
  // The answer to these params and this attempt, once it has arrived.
  current: RequestAnswer<P, T> | null;
  retry: () => void;
  // Forgets the last answer.
  reset: () => void;
};

// Runs `request(params, signal)` whenever `params` changes or Retry is pressed; `null` params send nothing.
// A new request cancels the previous one, and an answer to it, if it still arrives, is dropped.
// `params` are compared with `===`: a string, a number or a stable object. `request` must be stable too
// (declared at module level), or every render sends a new request.
export const useRequest = <P, T>(
  request: (params: P, signal: AbortSignal) => Promise<T>,
  params: P | null,
): UseRequestResult<P, T> => {
  const [attempt, setAttempt] = useState(0);
  const [latest, setLatest] = useState<RequestAnswer<P, T> | null>(null);

  useEffect(() => {
    if (params === null) {
      return;
    }

    // New params or a Retry run the cleanup first: the previous request is cancelled.
    const controller = new AbortController();
    const load = async (): Promise<void> => {
      try {
        const data = await request(params, controller.signal);
        if (!controller.signal.aborted) {
          setLatest({ params, attempt, data, failed: false });
        }
      } catch {
        if (!controller.signal.aborted) {
          setLatest({ params, attempt, data: null, failed: true });
        }
      }
    };
    void load();

    return () => controller.abort();
  }, [request, params, attempt]);

  return {
    latest,
    current: latest !== null && latest.params === params && latest.attempt === attempt ? latest : null,
    retry: () => setAttempt((n) => n + 1),
    reset: () => setLatest(null),
  };
};
