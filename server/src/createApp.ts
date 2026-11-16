import type { HealthResponse } from "@tv-shows-explorer/shared";
import { Hono } from "hono";

// The server's routes, without listening: `index` serves them, tests call `app.request()`.
export const createApp = (): Hono => {
  const app = new Hono();

  app.get("/api/health", (context) => {
    const body: HealthResponse = { status: "ok" };
    return context.json(body);
  });

  return app;
};
