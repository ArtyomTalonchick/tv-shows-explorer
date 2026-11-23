// The secret that signs and checks the tokens: `JWT_SECRET`, a Firebase secret in production and `server/.env`
// locally. Without it this throws, and the request fails with 500: no token is made or taken with an empty secret.
export const readJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (secret === undefined || secret === "") {
        throw new Error("JWT_SECRET is not set");
    }
    return secret;
};
