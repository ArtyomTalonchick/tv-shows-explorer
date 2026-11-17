// What the favorites router passes on to its routes: the client id its middleware read from `X-Client-Id`.
export type FavoritesEnv = {
    Variables: { clientId: string };
};
