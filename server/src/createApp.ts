import { Hono } from "hono";
import { cors } from "hono/cors";
import { routes } from "./routes/routes";

// The site on GitHub Pages, the only other origin that calls the API. In development the client reaches the server
// through Vite's proxy, from its own origin.
const SITE_ORIGIN = "https://artyomtalonchick.github.io";

// The server: the API routes under `/api`, without listening. `index` serves it locally, `function` on Firebase;
// tests call `app.request()`.
export const createApp = (): Hono => {
    const app = new Hono();

    app.use(
        "/api/*",
        cors({
            origin: SITE_ORIGIN,
            allowMethods: ["GET", "PUT", "DELETE"],
            allowHeaders: ["X-Client-Id", "Content-Type"],
        }),
    );
    app.route("/api", routes);

    return app;
};
