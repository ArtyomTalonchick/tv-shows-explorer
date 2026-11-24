import type { Credentials, SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { HttpError } from "~/lib/http/HttpError";
import { fetchJson } from "~/lib/http/fetchJson";
import { API_URL } from "~/tasks/constants";

// How a sign-in ended: the user is signed in, the server refused the email and the password, or there was no answer.
export type SignInResult = "signed-in" | "wrong-credentials" | "failed";

// Signs the user in with the email and the password and keeps the session in the store. Never rejects: a refusal (401)
// and a failure are returned, and the store stays as it was.
export const signIn = async (credentials: Credentials): Promise<SignInResult> => {
    try {
        const session = await fetchJson<SessionResponse>(`${API_URL}/session`, { method: "POST", body: credentials });
        useSessionStore.setState({ session });
        return "signed-in";
    } catch (error) {
        if (error instanceof HttpError && error.status === 401) {
            return "wrong-credentials";
        }
        return "failed";
    }
};
