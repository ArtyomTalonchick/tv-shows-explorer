import type { HealthResponse } from "@tv-shows-explorer/shared";
import { Hono } from "hono";

// `GET /api/health`: the server is up.
export const health = new Hono().get("/", (context) => {
  const body: HealthResponse = { status: "ok" };
  return context.json(body);
});
