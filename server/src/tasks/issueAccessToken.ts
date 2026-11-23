import { sign } from "hono/jwt";
import type { User } from "@tv-shows-explorer/shared";
import { readJwtSecret } from "./readJwtSecret";

// How long an access token lets its user in: 1 minute, in seconds. It travels with every request, so it lives short.
const ACCESS_TOKEN_LIFETIME = 60;

// An access token: a JWT that names the user for 1 minute, `sub` is its id and `typ` is "access", so `requireUser`
// tells it from a refresh token. Signed with HS256 and the secret of `readJwtSecret`, which throws without one.
export const issueAccessToken = async (user: User): Promise<string> => {
    const secret = readJwtSecret();
    const now = Math.floor(Date.now() / 1000);
    const payload = { sub: user.id, email: user.email, typ: "access", iat: now, exp: now + ACCESS_TOKEN_LIFETIME };
    return await sign(payload, secret, "HS256");
};
