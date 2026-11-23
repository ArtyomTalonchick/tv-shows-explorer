import { verify } from "hono/jwt";
import { readJwtSecret } from "./readJwtSecret";

// The user id (`sub`) of a token of this server of the given kind: signed with HS256 and the secret of
// `readJwtSecret`, not expired, and of that `typ`, so an access token and a refresh token never stand for each other.
// Null for any other token. Without a secret it throws, as `issueTokens` does.
export const verifyToken = async (token: string, kind: "access" | "refresh"): Promise<string | null> => {
    const secret = readJwtSecret();
    try {
        const { sub, typ } = await verify(token, secret, "HS256");
        return typ === kind && typeof sub === "string" ? sub : null;
    } catch {
        return null;
    }
};
