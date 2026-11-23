// A user as the API shows it: never the password or its hash.
export type User = {
    id: string;
    email: string;
};

// The pair of tokens of a signed-in user.
export type SessionTokens = {
    // A JWT for the next requests, sent as `Authorization: Bearer <token>`, valid for 1 minute.
    accessToken: string;
    // A JWT valid for 30 days, sent only to get a new pair once the access token runs out. Nothing opens with it.
    refreshToken: string;
};

// The answer of `POST /api/users` (sign up) and `POST /api/session` (sign in): a pair of tokens and the user they
// name. `GET /api/session` answers only the `User` of the access token. There is no sign-out request: the client
// drops its tokens.
export type SessionResponse = SessionTokens & {
    user: User;
};
