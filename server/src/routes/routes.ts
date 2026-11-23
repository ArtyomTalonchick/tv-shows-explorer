import { Hono } from "hono";
import { favorites } from "./favorites/favorites";
import { health } from "./health/health";
import { session } from "./session/session";
import { shows } from "./shows/shows";
import { users } from "./users/users";

// The table of the API's paths. Each path is a folder with a table of its methods and middleware (`shows/shows.ts`);
// each method is a handler in a folder of its own, named by its method and path (`shows/getShows` is
// `GET /api/shows`). `createApp` serves the table under `/api`.
// prettier-ignore
export const routes = new Hono()
    .route("/health", health)
    .route("/shows", shows)
    .route("/favorites", favorites)
    .route("/users", users)
    .route("/session", session);
