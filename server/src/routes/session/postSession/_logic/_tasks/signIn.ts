import { normalizeEmail } from "@tv-shows-explorer/shared";
import type { Credentials, SessionResponse } from "@tv-shows-explorer/shared";
import { verifyPassword } from "~/lib/password/verifyPassword";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";
import { issueAccessToken } from "~/tasks/issueAccessToken";

// Signs in the account of the email, when the password is its own: returns the token and the user, or null both for
// an email without an account and for a wrong password.
export const signIn = async (credentials: Credentials): Promise<SessionResponse | null> => {
    const stored = await usersStore.findByEmail(normalizeEmail(credentials.email));
    if (stored === null) {
        return null;
    }

    const matches = await verifyPassword(credentials.password, stored.passwordHash);
    if (!matches) {
        return null;
    }

    const user = { id: stored.id, email: stored.email };
    return { token: await issueAccessToken(user), user };
};
