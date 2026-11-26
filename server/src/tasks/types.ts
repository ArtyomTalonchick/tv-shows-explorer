// What the routes of a signed-in user get: the user id `requireUser` read from the access token's `sub`.
export type UserEnv = {
    Variables: { userId: string };
};
