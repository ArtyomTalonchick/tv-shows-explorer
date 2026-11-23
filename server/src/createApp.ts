import { Hono } from "hono";
import { routes } from "./routes/routes";

// The server: the API routes under `/api`, without listening. `index` serves it locally, `function` on Firebase;
// tests call `app.request()`. The site calls it from its own domain — Firebase Hosting in production, Vite's proxy in
// development — so the server needs no CORS.
export const createApp = (): Hono => {
    const app = new Hono();

    app.route("/api", routes);

    return app;
};
