import { credentialsSchema } from "@tv-shows-explorer/shared";
import { z } from "zod";

// The sign-in form: an email by the shared rule, and any password that is not empty. The password's length is the
// sign-up's rule, not applied here: an account made by an older rule can still sign in, and the server answers a
// short password as a wrong one.
export const signInFormSchema = credentialsSchema.extend({
    password: z.string().min(1),
});
