import type { RefreshBody, SessionResponse } from "@tv-shows-explorer/shared";
import { HttpError } from "~/lib/http/HttpError";
import { fetchJson } from "~/lib/http/fetchJson";
import { useSessionStore } from "~/stores/useSessionStore";
import { API_URL } from "~/tasks/constants";
import { signOut } from "./signOut";

// Exchanges the kept refresh token for a new session: on start, so a user who comes back stays signed in for another
// 30 days, and when the access token has run out (`fetchAsUser`). A token the server refuses (401, 400) signs the
// user out (`signOut`); with no answer (a network error, 5xx, `signal` aborts) the session stays as it was. Never
// rejects. An answer that comes after a sign-out or another sign-in is dropped: the store no longer holds the token
// it was asked for.
export const refreshSession = async (signal?: AbortSignal): Promise<void> => {
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
            signOut();
        }
    }
};
