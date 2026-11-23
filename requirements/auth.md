# Auth

## Purpose

A visitor gets an account with an email and a password, so their data can belong to them instead of to one browser.
This file is the server side; the pages of the client come in #62. (#61)

## Behaviour

1. **Sign up.** `POST /api/users` with `Credentials` (`{ "email": "anna@example.com", "password": "…" }`) makes an
   account and answers `201` with a `SessionResponse`: `{ token, user: { id, email } }`. The email and the password
   must pass the shared rule (`shared/src/credentials/`): an email of the form `name@domain.tld` with one `@` and
   no spaces, and a password of 8 characters or more. The client checks its form by the same rule. (#61)
2. **Sign in.** `POST /api/session` with `Credentials` checks the password of the account of that email and answers
   `200` with a `SessionResponse`. (#61)
3. **Who is signed in.** `GET /api/session` with `Authorization: Bearer <token>` answers the `User` of the token. (#61)
4. **The token** is a JWT signed with HS256: `sub` is the user id, with the email, `iat` and `exp`. It is valid for
   7 days; the client sends it in `Authorization: Bearer <token>`. There is no sign-out request: the client drops its
   token. (#61)
5. The email is kept and compared normalized: without outer spaces, in lower case. `Anna@Example.com ` signs up and
   signs in as `anna@example.com`. (#61)
6. The password is kept only as a salted `scrypt` hash (`<salt>:<hash>` in hex, a new random salt each time) and is
   checked in constant time. Neither the password nor its hash is ever answered or logged. (#61)
7. The accounts are kept in Firestore, a document per user, `users/{id}`, the id a random UUID; the tests mock the
   store. (#61)

## States

| State | What the server answers |
|---|---|
| Signed up | `201` and `{ token, user }` |
| Signed in | `200` and `{ token, user }` |
| A valid token | `GET /api/session`: `200` and `{ id, email }` |
| A body that is not JSON with a string email and password | `400`, nothing changes |
| Sign-up with an email or a password that breaks the rule | `400`, no account is made |
| Sign-up with an email that already has an account | `409` «This email already has an account» |
| Sign-in with an unknown email or a wrong password | `401` «Wrong email or password», the same for both |
| No token, not `Bearer`, a broken, expired or foreign token | `401` |
| A valid token of an account that is gone | `401` |
| The server has no `JWT_SECRET` | `500` on every sign-up, sign-in and `GET /api/session` |

## Edge cases

- Fields other than `email` and `password` in the body are ignored; nothing but the four fields of an account
  (`id`, `email`, `passwordHash`, `createdAt`) reaches the database.
- Sign-in does not check the password rule: an account made under an older rule can still sign in.
- Two sign-ups with one email within a fraction of a second can both pass and make two accounts: the check and the
  write are two requests. Accepted as rare (see Decisions).
- A token stays valid for its 7 days after a sign-out on the client, and after any change of the account: the
  server keeps no list of tokens and cannot take one back (see Decisions, #69).
- The secret differs between the local server (`server/.env`) and production (a Firebase secret), so a token made
  locally does not open production.

## Decisions

- The rule of a valid email and password is runtime code in the shared package, so the client and the server check
  by one rule; a deliberate exception from the simple-architecture rules
  (`.claude/rules/architecture-exceptions.md`, plugin #35). The shared package is split into folders by
  subject. (#61)
- Accounts are keyed by a random id, `users/{id}`, not by the email, the owner's choice: the favourites of #63 go
  under `users/{id}/favorites`. (#61)
- «Email taken» is checked by sign-up before the write (`findByEmail`, then `create`), not by an atomic create:
  two sign-ups with one email within a moment could both pass. Accepted as rare, by the code-style rule of the
  simplest code (#41); no transaction. (#61)
- An unknown email and a wrong password give one `401` with one message, so the answer does not tell which emails
  have accounts. The answer time still may: an unknown email skips the `scrypt` check. Accepted; no dummy hash. (#61)
- One token for 7 days, not a pair of access and refresh tokens, and no server-side sign-out: the simplest scheme
  for this task. Its costs — a stolen token works for its whole life, and nothing can revoke it — are taken up in
  #69, which adds a short access token and a revocable refresh token. (#61)
- The token secret is `JWT_SECRET`: a Firebase secret bound to the function in production
  (`firebase functions:secrets:set JWT_SECRET` before the deploy), `server/.env` locally. It is not checked on the
  server's start, unlike the Google credentials (exception #72): a missing secret fails the auth requests with `500`,
  and the rest of the API still works. (#61)
- A body is read as text and checked by hand (`parseCredentials`), as the favorites body is, not with a schema
  library: shared schemas are #31. (#61)
- The token check is the project's own middleware on `verify` of `hono/jwt`, not Hono's `jwt()` middleware: that
  one answers a failure as plain text, and every other error of the API is JSON `{ error }`. (#61)
