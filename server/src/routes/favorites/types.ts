import type { UserEnv } from "~/tasks/types";

// What the routes of one favorite, `/:id`, get on top of the signed-in user: the show id its middleware read from the
// path.
export type FavoriteEnv = {
    Variables: UserEnv["Variables"] & { showId: number };
};
