import type { RefreshBody, SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { HttpError } from "~/lib/http/HttpError";
import { fetchJson } from "~/lib/http/fetchJson";
import { API_URL } from "~/tasks/constants";

// Exchanges the kept refresh token for a new session, so a user who comes back stays signed in for another 30 days.
// A token the server refuses (401, 400) makes the user a guest; with no answer (a network error, 5xx, `signal`
// aborts) the session stays as it was. Never rejects. An answer that comes after a sign-out or another sign-in is
// dropped: the store no longer holds the token it was asked for.
export const restoreSession = async (signal: AbortSignal): Promise<void> => {
    const refreshToken = useSessionStore.getState().session?.refreshToken;
    if (refreshToken === undefined) {
        return;
    }
    const isAsked = (): boolean => useSessionStore.getState().session?.refreshToken === refreshToken;

    try {
        const body: RefreshBody = { refreshToken };
        const session = await fetchJson<SessionResponse>(`${API_URL}/session/refresh`, {
            method: "POST",
            body,
            signal,
        });
        if (isAsked()) {
            useSessionStore.setState({ session });
        }
    } catch (error) {
        const isRefused = error instanceof HttpError && (error.status === 401 || error.status === 400);
        if (isRefused && isAsked()) {
            useSessionStore.setState({ session: null });
        }
    }
};
