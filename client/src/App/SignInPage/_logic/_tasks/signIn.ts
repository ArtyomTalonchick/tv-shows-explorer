import { fetchJson, HttpError, sessionResponseSchema, type Credentials, type Show } from "@tv-shows-explorer/shared";
import { API_URL } from "~/tasks/constants";
import { keepSession } from "~/tasks/session/keepSession";

// How a sign-in ended: the user is signed in, the server refused the email and the password, or there was no answer.
export type SignInResult = "signed-in" | "wrong-credentials" | "failed";

// Signs the user in with the email and the password, keeps the session, loads the user's favourites and adds the
// show they bookmarked as a guest, if any (`keepSession`). Never rejects: a refusal (401) and a failure are returned,
// and the stores stay as they were.
export const signIn = async (credentials: Credentials, pending: Omit<Show, "rating"> | null): Promise<SignInResult> => {
    try {
        const session = await fetchJson(`${API_URL}/session`, sessionResponseSchema, {
            method: "POST",
            body: credentials,
        });
        await keepSession(session, pending);
        return "signed-in";
    } catch (error) {
        if (error instanceof HttpError && error.status === 401) {
            return "wrong-credentials";
        }
        return "failed";
    }
};
