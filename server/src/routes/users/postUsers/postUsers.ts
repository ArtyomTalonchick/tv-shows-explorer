import type { Handler } from "hono";
import { PASSWORD_MIN_LENGTH, isValidEmail, isValidPassword } from "@tv-shows-explorer/shared";
import { parseCredentials } from "~/tasks/parseCredentials";
import { signUp } from "./_logic/_tasks/signUp";

// `POST /api/users` with `Credentials`: makes an account and signs it in, answering 201 with a `SessionResponse`.
// 400 when the body is not a valid email and a password of the shared rule, 409 when the email already has an account.
export const postUsers: Handler = async (context) => {
    const credentials = parseCredentials(await context.req.text());
    const valid = credentials !== null && isValidEmail(credentials.email) && isValidPassword(credentials.password);
    if (!valid) {
        const error = `Expected a JSON body with a valid email and a password of ${PASSWORD_MIN_LENGTH} characters or more`;
        return context.json({ error }, 400);
    }

    const session = await signUp(credentials);
    if (session === null) {
        return context.json({ error: "This email already has an account" }, 409);
    }
    return context.json(session, 201);
};
