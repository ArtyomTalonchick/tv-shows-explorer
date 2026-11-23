import { Hono } from "hono";
import { getSession } from "./getSession/getSession";
import { requireUser } from "./_logic/requireUser";
import { postSession } from "./postSession/postSession";
import { postSessionRefresh } from "./postSessionRefresh/postSessionRefresh";
import type { SessionEnv } from "./types";

// `/api/session`: signing in. `POST` signs a user in with an email and a password; `POST /refresh` exchanges a
// refresh token for a new pair; `GET` answers the user of the access token, so only it needs one. There is no
// sign-out request: the client drops its tokens.
// prettier-ignore
export const session = new Hono<SessionEnv>()
    .post("/", postSession)
    .post("/refresh", postSessionRefresh)
    .get("/", requireUser, getSession);
