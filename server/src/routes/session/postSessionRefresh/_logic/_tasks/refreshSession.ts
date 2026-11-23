import type { SessionResponse } from "@tv-shows-explorer/shared";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";
import { startSession } from "~/tasks/session/startSession";
import { verifyToken } from "~/tasks/session/jwt/verifyToken";

// Exchanges a refresh token for a new session: a new pair of tokens and the user, or null when the token is not a
// valid refresh token of this server or names an account that is gone. The old refresh token stays valid until its
// end: the server keeps nothing of it (#70).
export const refreshSession = async (refreshToken: string): Promise<SessionResponse | null> => {
    const userId = await verifyToken(refreshToken, "refresh");
    if (userId === null) {
        return null;
    }

    const stored = await usersStore.get(userId);
    if (stored === null) {
        return null;
    }
    return await startSession({ id: stored.id, email: stored.email });
};
