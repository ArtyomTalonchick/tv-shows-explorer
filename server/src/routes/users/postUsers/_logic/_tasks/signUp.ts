import { randomUUID } from "node:crypto";
import { normalizeEmail } from "@tv-shows-explorer/shared";
import type { Credentials, SessionResponse, User } from "@tv-shows-explorer/shared";
import { hashPassword } from "~/lib/password/hashPassword";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";
import { issueAccessToken } from "~/tasks/issueAccessToken";

// Makes an account of valid credentials and signs it in: the email normalized, the password kept only as its hash,
// a new random id. Returns the token and the user, or null when the email already has an account. The check and the
// write are two requests: two sign-ups with one email within a moment can both pass — accepted, see
// `requirements/auth.md`.
export const signUp = async (credentials: Credentials): Promise<SessionResponse | null> => {
    const email = normalizeEmail(credentials.email);
    const taken = await usersStore.findByEmail(email);
    if (taken !== null) {
        return null;
    }

    const user: User = { id: randomUUID(), email };
    const passwordHash = await hashPassword(credentials.password);
    await usersStore.create({ ...user, passwordHash, createdAt: Date.now() });
    return { token: await issueAccessToken(user), user };
};
