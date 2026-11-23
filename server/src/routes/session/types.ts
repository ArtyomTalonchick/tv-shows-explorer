// What the routes of a signed-in user get: the user id its middleware read from the token's `sub`.
export type SessionEnv = {
    Variables: { userId: string };
};
