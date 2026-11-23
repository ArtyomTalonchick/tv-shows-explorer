// A user as the API shows it: never the password or its hash.
export type User = {
    id: string;
    email: string;
};

// The answer of `POST /api/users` (sign up) and `POST /api/session` (sign in): a token for the next requests, sent as
// `Authorization: Bearer <token>` and valid for 1 minute, and the user it names. `GET /api/session` answers only the
// `User` of the token. There is no sign-out request: the client drops its token.
export type SessionResponse = {
    token: string;
    user: User;
};
