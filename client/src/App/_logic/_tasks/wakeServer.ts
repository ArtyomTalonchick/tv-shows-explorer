import { healthResponseSchema } from "@tv-shows-explorer/shared";
import { fetchJson } from "~/lib/http/fetchJson";
import { API_URL } from "~/tasks/constants";

// Asks the app's server whether it is up, only to wake it: the server scales to zero, so the first request after a
// pause waits for a cold start, and that would otherwise be the user's search. Never rejects: a failed, refused or
// cancelled request changes nothing, and nobody reads the answer.
export const wakeServer = async (signal: AbortSignal): Promise<void> => {
    try {
        await fetchJson(`${API_URL}/health`, healthResponseSchema, { signal });
    } catch {
        // The search sends its own request and shows its own error.
    }
};
