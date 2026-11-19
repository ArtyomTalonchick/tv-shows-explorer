// What the favorites router passes on to its routes: the client id its middleware read from `X-Client-Id`.
export type FavoritesEnv = {
    Variables: { clientId: string };
};

// What the routes of one favorite, `/:id`, get on top: the show id its middleware read from the path.
export type FavoriteEnv = {
    Variables: { clientId: string; showId: number };
};
