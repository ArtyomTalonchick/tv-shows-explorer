import { sign } from "hono/jwt";
import type { User } from "@tv-shows-explorer/shared";

// How long a token lets its user in: 7 days, in seconds.
const TOKEN_LIFETIME = 7 * 24 * 60 * 60;

// A JWT that names the user for 7 days: `sub` is its id, signed with HS256 and the secret of `JWT_SECRET` — a
// Firebase secret in production, `server/.env` locally. Without the secret it throws, and the request fails with 500.
export const issueToken = async (user: User): Promise<string> => {
    const secret = process.env.JWT_SECRET;
    if (secret === undefined || secret === "") {
        throw new Error("JWT_SECRET is not set");
    }

    const now = Math.floor(Date.now() / 1000);
    return await sign({ sub: user.id, email: user.email, iat: now, exp: now + TOKEN_LIFETIME }, secret, "HS256");
};
