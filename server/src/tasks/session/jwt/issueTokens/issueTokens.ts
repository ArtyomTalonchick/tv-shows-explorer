import type { SessionTokens, User } from "@tv-shows-explorer/shared";
import { issueSingleToken } from "./issueSingleToken";

// How long an access token lets its user in: 1 minute, in seconds. It travels with every request, so it lives short.
const ACCESS_TOKEN_LIFETIME = 60;
// How long a refresh token lets its user get a new pair: 30 days, in seconds. It travels only on sign-in and on its
// exchange, so it lives long. The server keeps nothing of it, so it cannot be revoked before its end (#70).
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60;

// A new pair of an access token and a refresh token of the user, for `startSession`. `typ` tells the two apart, so
// `requireUser` takes only an access token.
export const issueTokens = async (user: User): Promise<SessionTokens> => {
    const accessToken = await issueSingleToken({
        payload: { sub: user.id, email: user.email, typ: "access" },
        lifetime: ACCESS_TOKEN_LIFETIME,
    });
    const refreshToken = await issueSingleToken({
        payload: { sub: user.id, typ: "refresh" },
        lifetime: REFRESH_TOKEN_LIFETIME,
    });
    return { accessToken, refreshToken };
};
