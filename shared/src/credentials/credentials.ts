// The body of `POST /api/users` (sign up) and `POST /api/session` (sign in). The client checks a sign-up form, and
// the server a sign-up request, by one rule of this package — `isValidEmail` and `isValidPassword` — so the two
// cannot disagree; the server keeps and compares the email by `normalizeEmail`. That runtime code is a deliberate
// exception from the simple-architecture rules (`.claude/rules/architecture-exceptions.md`).
export type Credentials = {
    email: string;
    password: string;
};
