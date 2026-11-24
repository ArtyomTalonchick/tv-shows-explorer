import type { Credentials, SessionResponse } from "@tv-shows-explorer/shared";
import { HttpError } from "~/lib/http/HttpError";
import { fetchJson } from "~/lib/http/fetchJson";
import { API_URL } from "~/tasks/constants";
import { keepSession } from "~/tasks/session/keepSession";

// How a sign-up ended: the account is made and signed in, the email already has one, or there was no answer.
export type SignUpResult = "signed-up" | "email-taken" | "failed";

// Makes an account with the email and the password and keeps its session (`keepSession`). Never rejects: a taken
// email (409) and a failure are returned, and the stores stay as they were.
export const signUp = async (credentials: Credentials): Promise<SignUpResult> => {
    try {
        const session = await fetchJson<SessionResponse>(`${API_URL}/users`, { method: "POST", body: credentials });
        await keepSession(session);
        return "signed-up";
    } catch (error) {
        if (error instanceof HttpError && error.status === 409) {
            return "email-taken";
        }
        return "failed";
    }
};
