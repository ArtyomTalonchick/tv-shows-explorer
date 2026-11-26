import { credentialsSchema } from "@tv-shows-explorer/shared";
import { withValid } from "~/lib/validation/withValid";
import { signUp } from "./_logic/_tasks/signUp";

// `POST /api/users` with `Credentials`: makes an account and signs it in, answering 201 with a `SessionResponse`.
// 400 when the body is not JSON of the shared rule (`credentialsSchema`), 409 when the email already has an account.
export const postUsers = withValid({ json: credentialsSchema }, async (context, { json }) => {
    const session = await signUp(json);
    if (session === null) {
        return context.json({ error: "This email already has an account" }, 409);
    }
    return context.json(session, 201);
});
