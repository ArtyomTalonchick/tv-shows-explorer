import { Hono } from "hono";
import { health } from "./health/health";
import { shows } from "./shows/shows";

// The server's routes, without listening: `index` serves them, tests call `app.request()`.
export const createApp = (): Hono => {
  const app = new Hono();

  app.route("/api/health", health);
  app.route("/api/shows", shows);

  return app;
};
