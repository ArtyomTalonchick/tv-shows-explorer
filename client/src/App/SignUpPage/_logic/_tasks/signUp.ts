import type { Credentials, SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/App/_stores/useSessionStore";
import { HttpError } from "~/lib/http/HttpError";
import { fetchJson } from "~/lib/http/fetchJson";
import { API_URL } from "~/tasks/constants";

// How a sign-up ended: the account is made and signed in, the email already has one, or there was no answer.
export type SignUpResult = "signed-up" | "email-taken" | "failed";

// Makes an account with the email and the password and keeps its session in the store. Never rejects: a taken email
// (409) and a failure are returned, and the store stays as it was.
export const signUp = async (credentials: Credentials): Promise<SignUpResult> => {
    try {
        const session = await fetchJson<SessionResponse>(`${API_URL}/users`, { method: "POST", body: credentials });
        useSessionStore.setState({ session });
        return "signed-up";
    } catch (error) {
        if (error instanceof HttpError && error.status === 409) {
            return "email-taken";
        }
        return "failed";
    }
};
