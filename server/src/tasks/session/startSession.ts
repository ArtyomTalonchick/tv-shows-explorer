import type { SessionResponse, User } from "@tv-shows-explorer/shared";
import { issueTokens } from "./jwt/issueTokens/issueTokens";

// Signs the user in: a new pair of tokens, with the user they name. Called by sign-up, sign-in and the exchange of a
// refresh token.
export const startSession = async (user: User): Promise<SessionResponse> => {
    const tokens = await issueTokens(user);
    return { ...tokens, user };
};
