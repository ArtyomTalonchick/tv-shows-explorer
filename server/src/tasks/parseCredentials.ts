import type { Credentials } from "@tv-shows-explorer/shared";

// The `Credentials` of a request body: a JSON object with a string `email` and a string `password`; null for
// anything else. It checks only the shape: sign-up checks the rule of a valid email and password on top, sign-in
// does not, so an account made by an older rule can still sign in.
export const parseCredentials = (body: string): Credentials | null => {
    const value = ((): unknown => {
        try {
            return JSON.parse(body);
        } catch {
            return null;
        }
    })();
    if (typeof value !== "object" || value === null) {
        return null;
    }

    const { email, password } = value as Record<string, unknown>;
    if (typeof email !== "string" || typeof password !== "string") {
        return null;
    }
    return { email, password };
};
