import type { HealthResponse } from "@tv-shows-explorer/shared";
import type { Handler } from "hono";

// `GET /api/health`: the server is up.
export const getHealth: Handler = (context) => {
  const body: HealthResponse = { status: "ok" };
  return context.json(body);
};
