import { Hono } from "hono";
import { getSession } from "./getSession/getSession";
import { requireUser } from "./_logic/requireUser";
import { postSession } from "./postSession/postSession";
import type { SessionEnv } from "./types";

// `/api/session`: signing in. `POST` signs a user in with an email and a password; `GET` answers the user of the
// token, so only it needs one. There is no sign-out request: the client drops its tokens.
// prettier-ignore
export const session = new Hono<SessionEnv>()
    .post("/", postSession)
    .get("/", requireUser, getSession);
