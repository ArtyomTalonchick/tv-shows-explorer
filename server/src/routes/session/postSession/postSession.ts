import { withValid } from "~/lib/validation/withValid";
import { signIn } from "./_logic/_tasks/signIn";
import { signInBodySchema } from "./_logic/signInBodySchema";

// `POST /api/session` with a `SignInBody`: signs a user in, answering 200 with a `SessionResponse`. 400 when the body
// is not JSON of an email and a password (`signInBodySchema`); 401 with one message for an unknown email and a wrong
// password, so the answer does not tell which emails have an account. The rule of sign-up is not applied: an account
// made by an older rule can still sign in.
export const postSession = withValid({ json: signInBodySchema }, async (context, { json }) => {
    const session = await signIn(json);
    if (session === null) {
        return context.json({ error: "Wrong email or password" }, 401);
    }
    return context.json(session, 200);
});
