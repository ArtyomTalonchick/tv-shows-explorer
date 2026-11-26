import { Hono } from "hono";
import { requireUser } from "~/tasks/session/requireUser";
import type { UserEnv } from "~/tasks/types";
import { getSession } from "./getSession/getSession";
import { postSession } from "./postSession/postSession";
import { postSessionRefresh } from "./postSessionRefresh/postSessionRefresh";

// `/api/session`: signing in. `POST` signs a user in with an email and a password; `POST /refresh` exchanges a
// refresh token for a new pair; `GET` answers the user of the access token, so only it needs one. There is no
// sign-out request: the client drops its tokens.
// prettier-ignore
export const session = new Hono<UserEnv>()
    .post("/", ...postSession)
    .post("/refresh", ...postSessionRefresh)
    .get("/", requireUser, getSession);
