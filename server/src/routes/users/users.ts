import { Hono } from "hono";
import { postUsers } from "./postUsers/postUsers";

// `/api/users`: the accounts. `POST` signs a visitor up; there is no other request.
// prettier-ignore
export const users = new Hono()
    .post("/", ...postUsers);
