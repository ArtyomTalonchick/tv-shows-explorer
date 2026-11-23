import { Hono } from "hono";
import { postSession } from "./postSession/postSession";

// `/api/session`: signing in. `POST` signs a user in with an email and a password; there is no sign-out request, the
// client drops its token.
// prettier-ignore
export const session = new Hono()
    .post("/", postSession);
