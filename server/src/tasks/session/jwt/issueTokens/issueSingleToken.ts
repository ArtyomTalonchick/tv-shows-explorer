import { sign } from "hono/jwt";
import { readJwtSecret } from "../readJwtSecret";

type IssueSingleTokenParams = {
    // The claims of the token; `iat` and `exp` are added here.
    payload: Record<string, unknown>;
    // How long the token is valid, in seconds.
    lifetime: number;
};

const MILLISECONDS_PER_SECOND = 1000;

// One JWT of `issueTokens`: the payload with `iat` (now) and `exp` (now + lifetime), signed with HS256 and the secret
// of `readJwtSecret`, which throws without one.
export const issueSingleToken = async ({ payload, lifetime }: IssueSingleTokenParams): Promise<string> => {
    const secret = readJwtSecret();
    const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
    const fullPayload = { ...payload, iat: now, exp: now + lifetime };
    return await sign(fullPayload, secret, "HS256");
};
