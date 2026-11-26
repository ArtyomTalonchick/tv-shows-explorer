import { fetchJson, HttpError, sessionResponseSchema, type Credentials, type Show } from "@tv-shows-explorer/shared";
import { API_URL } from "~/tasks/constants";
import { keepSession } from "~/tasks/session/keepSession";

// How a sign-up ended: the account is made and signed in, the email already has one, or there was no answer.
export type SignUpResult = "signed-up" | "email-taken" | "failed";

// Makes an account with the email and the password, keeps its session and adds the show bookmarked as a guest, if
// any (`keepSession`). Never rejects: a taken email (409) and a failure are returned, and the stores stay as they
// were.
export const signUp = async (credentials: Credentials, pending: Omit<Show, "rating"> | null): Promise<SignUpResult> => {
    try {
        const session = await fetchJson(`${API_URL}/users`, sessionResponseSchema, {
            method: "POST",
            body: credentials,
        });
        await keepSession(session, pending);
        return "signed-up";
    } catch (error) {
        if (error instanceof HttpError && error.status === 409) {
            return "email-taken";
        }
        return "failed";
    }
};
