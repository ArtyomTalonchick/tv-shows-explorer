# Auth

## Purpose

A visitor gets an account with an email and a password, so their data can belong to them instead of to one browser.
Behaviour 1–8 are the server side, 9–14 the pages and the header of the client. (#61, #62)

A session is a pair of tokens: a short access token that travels with every request, and a long refresh token that
travels only on sign-in and on its exchange for a new pair, so it is harder to steal. (#69)

## Behaviour

1. **Sign up.** `POST /api/users` with `Credentials` (`{ "email": "anna@example.com", "password": "…" }`) makes an
   account and answers `201` with a `SessionResponse`: `{ accessToken, refreshToken, user: { id, email } }`. The
   email and the password must pass the shared rule (`shared/src/credentials/`): an email of the form
   `name@domain.tld` with one `@` and no spaces, and a password of 8 characters or more. The client checks its form
   by the same rule. (#61)
2. **Sign in.** `POST /api/session` with `Credentials` checks the password of the account of that email and answers
   `200` with a `SessionResponse`. (#61)
3. **Who is signed in.** `GET /api/session` with `Authorization: Bearer <access token>` answers the `User` of the
   token. (#61)
4. **The tokens** are JWTs signed with HS256 and `JWT_SECRET`, with `sub` (the user id), `typ`, `iat` and `exp`:
   - the access token, `typ: "access"`, with the email too, is valid for 1 minute; the client sends it in
     `Authorization: Bearer <token>`, and only it opens the routes; (#61, #69)
   - the refresh token, `typ: "refresh"`, is valid for 30 days; it opens no route and is sent only to get a new
     pair. (#69)

   There is no sign-out request: the client drops its tokens. (#61, #69)
5. **Refresh.** `POST /api/session/refresh` with a `RefreshBody` (`{ "refreshToken": "…" }`) answers `200` with a new
   `SessionResponse`: a new access token, a new refresh token for another 30 days, and the user. (#69)
6. The email is kept and compared normalized: without outer spaces, in lower case. `Anna@Example.com ` signs up and
   signs in as `anna@example.com`. (#61)
7. The password is kept only as a salted `scrypt` hash (`<salt>:<hash>` in hex, a new random salt each time) and is
   checked in constant time. Neither the password nor its hash is ever answered or logged. (#61)
8. The accounts are kept in Firestore, a document per user, `users/{id}`, the id a random UUID; the tests mock the
   store. (#61)
9. **The sign-in page**, `/sign-in`, and **the sign-up page**, `/sign-up`, are a card over the backdrop of the
   start screen, with the logo that leads back to the search and a line that leads to the other page. (#62)
10. **The forms** check their fields before any request, by the shared rule: sign-up a field as it loses focus,
    sign-in on submit. «Enter an email like name@example.com», «The password needs at least 8 characters» on
    sign-up, «Enter your password» on sign-in. While the request is on its way the fields are disabled and the button
    shows a spinner. Signed up or signed in, the user lands on the search. (#62)
11. **The header** of the start screen and of the search bar shows a guest «Sign in», which leads to `/sign-in`, and
    a signed-in user the avatar with the first letter of the email; it opens the full email and «Sign out». (#62)
12. **Sign out** drops the session and the user's favourites at once, with no request: the page is a guest's.
    (#62, #63)
13. **After a reload** the user is shown signed in at once, from the session the browser keeps
    (`tv-shows-explorer:session` in `localStorage`); the app then exchanges the refresh token once
    (`POST /api/session/refresh`) and keeps the new pair. A refused token (`401`, `400`) signs the user out, as
    Sign out does. (#62, #63)
14. **A signed-in user** who opens `/sign-in` or `/sign-up` is taken to the search. (#62)

## States

| State | What the server answers |
|---|---|
| Signed up | `201` and `{ accessToken, refreshToken, user }` |
| Signed in | `200` and `{ accessToken, refreshToken, user }` |
| A valid access token | `GET /api/session`: `200` and `{ id, email }` |
| A valid refresh token | `POST /api/session/refresh`: `200` and a new `{ accessToken, refreshToken, user }` |
| A body that is not JSON with a string email and password | `400`, nothing changes |
| Sign-up with an email or a password that breaks the rule | `400`, no account is made |
| Sign-up with an email that already has an account | `409` «This email already has an account» |
| Sign-in with an unknown email or a wrong password | `401` «Wrong email or password», the same for both |
| No token, not `Bearer`, a broken, expired or foreign token, a refresh token | `401` |
| A valid token of an account that is gone | `401` |
| Refresh with a broken, expired or foreign token, an access token, or the token of an account that is gone | `401` |
| Refresh with a body that is not JSON with a string `refreshToken` | `400` |
| The server has no `JWT_SECRET` | `500` on every sign-up, sign-in, refresh and `GET /api/session` |

| State in the app | What the user sees |
|---|---|
| A guest | «Sign in» in the header |
| Signed in | The avatar with the initial in the header; its menu holds the email and «Sign out» |
| A field breaks the rule | Its error under the field, no request |
| Sign-up with a taken email | «This email already has an account. Sign in» under the email, until it changes |
| Sign-in with a wrong email or password | «Wrong email or password.» over the form |
| The form gets no answer | «Couldn’t reach the server. Check your connection and try again.» over the form |

## Edge cases

- Fields other than `email` and `password` in the body are ignored; nothing but the four fields of an account
  (`id`, `email`, `passwordHash`, `createdAt`) reaches the database.
- Sign-in does not check the password rule: an account made under an older rule can still sign in.
- Two sign-ups with one email within a fraction of a second can both pass and make two accounts: the check and the
  write are two requests. Accepted as rare (see Decisions).
- A refresh token stays valid for its 30 days after a sign-out on the client, after its exchange for a new pair, and
  after any change of the account: the server keeps no list of tokens and cannot take one back (see Decisions). (#69)
- An active user stays signed in: each refresh gives a refresh token for another 30 days. (#69)
- A reload with no answer to the refresh (offline, `5xx`) keeps the user signed in with the old pair, with no
  toast: the next reload, or the refresh on a `401` of #63, exchanges it. (#62)
- An answer to the refresh that comes after a sign-out or another sign-in is dropped, so it never brings the old
  session back. (#62)
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
- A pair of tokens instead of the one 7-day token of #61: the access token travels with every request, so it lives
  1 minute; the refresh token travels only on sign-in and on refresh, so it is harder to steal, and lives 30 days.
  1 minute is the owner's choice: a refresh a minute costs nothing at this scale. (#69)
- Nothing of the tokens is stored on the server, and no cookie holds them: the client keeps both, the simplest
  scheme. Its cost: a stolen refresh token works for its 30 days, a sign-out cannot revoke it, and it is not
  one-time — a one-time token needs the server to remember that it was used. A refresh cookie (`__session`, the only
  cookie Firebase Hosting passes on to the function) or revocable tokens kept as hashes in Firestore are #70. (#69)
- The kind of a token is its `typ` claim, under the one `JWT_SECRET`, not a secret per kind: `verifyToken` takes a
  token only of the kind asked for. (#69)
- The token secret is `JWT_SECRET`: a Firebase secret bound to the function in production
  (`firebase functions:secrets:set JWT_SECRET` before the deploy), `server/.env` locally. It is not checked on the
  server's start, unlike the Google credentials (exception #72): a missing secret fails the auth requests with `500`,
  and the rest of the API still works. (#61)
- A body is read as text and checked by hand (`parseCredentials`), as the favorites body is, not with a schema
  library: shared schemas are #31. (#61)
- Sign out keeps the favourites as they are: until #63 they belong to the browser (`X-Client-Id`), not to the
  user. (#62) Replaced in #63: the favourites belong to the user, and Sign out drops them with the session.
- The forms are built on react-hook-form: the touched state, the errors and the submit state of a form are its
  job, not hand-written state. (#62)
- The token check is the project's own middleware on `verify` of `hono/jwt`, not Hono's `jwt()` middleware: that
  one answers a failure as plain text, and every other error of the API is JSON `{ error }`. (#61)
