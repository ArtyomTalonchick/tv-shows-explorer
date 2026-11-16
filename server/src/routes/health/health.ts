import { Hono } from "hono";
import { getHealth } from "./getHealth/getHealth";

// `/api/health`: its methods.
// prettier-ignore
export const health = new Hono()
    .get("/", getHealth);
