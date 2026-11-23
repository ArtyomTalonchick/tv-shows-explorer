import type { Handler } from "hono";
import { parseCredentials } from "~/tasks/parseCredentials";
import { signIn } from "./_logic/_tasks/signIn";

// `POST /api/session` with `Credentials`: signs a user in, answering 200 with a `SessionResponse`. 400 when the body
// is not an email and a password; 401 with one message for an unknown email and a wrong password, so the answer does
// not tell which emails have an account. The password rule of sign-up is not applied: an account made by an older
// rule can still sign in.
export const postSession: Handler = async (context) => {
    const credentials = parseCredentials(await context.req.text());
    if (credentials === null) {
        return context.json({ error: "Expected a JSON body with an email and a password" }, 400);
    }

    const session = await signIn(credentials);
    if (session === null) {
        return context.json({ error: "Wrong email or password" }, 401);
    }
    return context.json(session, 200);
};
