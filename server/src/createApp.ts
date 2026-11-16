import { Hono } from "hono";
import { routes } from "./routes/routes";

// The server: the API routes under `/api`, without listening. `index` serves it, tests call `app.request()`.
export const createApp = (): Hono => {
  const app = new Hono();

  app.route("/api", routes);

  return app;
};
