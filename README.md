# TV Shows Explorer

A small app to search TV shows from the public [TVmaze API](https://www.tvmaze.com/api): type a query, browse
the results three per page, filter them by genre, sign up, and keep the shows you like in your favourites. The app
has its own server: the client never calls TVmaze itself.

**Live:** https://tv-shows-explorer.web.app — on Firebase Hosting; its server answers on the same domain at `/api`
(a Cloud Function on Firebase; the users and their favourites are kept in Firestore).

The app is built step by step on the Simple Architecture approach. The architecture rules written along the way
are turned into AI rules (see [AI Rules](#ai-rules)).

## Features

- **Search.** The app starts with an empty list and a search field. The query goes to the app's server, which asks
  TVmaze.
- **List and pagination.** Results are shown as cards, three per page, with page switching. The server cuts the
  pages.
- **Genre filter.** The genres of the found shows are shown as chips above the list. A chip keeps only the shows of
  that genre; the filter can be reset. The server does the filtering.
- **Cache.** The server keeps the answer of TVmaze for 5 minutes: the same search — with any genre or page — is
  answered without asking TVmaze again.
- **Accounts.** A visitor signs up and signs in with an email and a password, on pages of their own
  (`/sign-up`, `/sign-in`); the header shows the user and Sign out. The session is a short access token and a
  30-day refresh token, and it survives a reload. What the app does not do:
  - the email is not verified;
  - there is no password reset: a lost password means a new account;
  - a token cannot be revoked before it expires, not even by Sign out.
- **Favourites.** A bookmark on every show card adds the show to the favourites of the signed-in user or removes
  it, and a toast says what was done. The Favourites button on both screens shows how many there are and opens
  their list; a show removed there stays in its row, dimmed, and can be put back while the list is open. The change
  shows at once and is undone if the server fails. A guest who bookmarks a show is asked to sign in, and the show
  is added once they do.
- **Stored on the server.** The accounts and the favourites logic are on the server; the users and their
  favourites are kept in Firestore, in local development too, so a list is the same on every device and survives
  a restart of the server.
- **Checked data.** The requests, the answers and the sign-in and sign-up forms are checked by one set of schemas,
  shared by the client and the server: a request the server does not accept is refused, and an answer the client
  does not expect shows as an error.
- **Quick first search.** The app wakes its server as soon as it opens, so the first search after a pause does not
  wait for a cold start.
- **Installable.** The app has its own icon and can be installed on a phone or a desktop.

What each feature does is described in [`requirements/`](requirements/README.md).

## AI Rules

The architecture rules live in their own repository, a Claude Code plugin:
[`claude-simple-architecture`](https://github.com/ArtyomTalonchick/claude-simple-architecture).
This version is built by the rules of
[`v0.3.3`](https://github.com/ArtyomTalonchick/claude-simple-architecture/tree/v0.3.3). The client and the server
both follow them: the same levels, tasks and stores on each side.

In this repository:

- [`CLAUDE.md`](CLAUDE.md) — the project instructions for the agent;
- [`.claude/simple-architecture/config.json`](.claude/simple-architecture/config.json) — where the plugin finds the
  client and the server, and the folder names;
- [`.claude/rules/`](.claude/rules/) — the project's code style;
- [`.claude/gh-tasks/rules.md`](.claude/gh-tasks/rules.md) — how a task is picked, built, checked and released
  (run with the gh-tasks plugin for Claude Code).

## Stack

An npm workspaces monorepo in TypeScript:

- **Client:** React 19, React Router, Chakra UI v3, Zustand, react-hook-form, Zod, Vite, Vitest with Testing
  Library; served by Firebase Hosting.
- **Server:** Node, Hono (JWT from `hono/jwt`), Zod, Firebase Admin SDK, Vitest; a Cloud Function on Firebase, with
  the users and their favourites in Firestore.
- **Shared:** the Zod schemas of the data the client and the server exchange, and the request helper both use.
- **Tooling:** ESLint and Prettier for the whole repository.

## Repository layout

| Path | What it is |
|---|---|
| `client/` | The app (Vite, React); deployed to Firebase Hosting |
| `server/` | The API server (Hono); deployed to Firebase as a Cloud Function |
| `shared/` | What the client and the server share: the Zod schemas of the API and its types, a folder per subject, and the JSON request helper |
| `design/` | Design tokens, mockups and screenshots of each version |
| `requirements/` | What each feature does: the source of truth for the code |
| `.github/workflows/` | CI (lint, format, type check, tests of every package), and the deploy of the client and the server to Firebase; the deploy needs the secret `FIREBASE_SERVICE_ACCOUNT` |
| `firebase.json`, `.firebaserc` | The Firebase project: the Hosting of the client, which hands `/api/**` to the Cloud Function built from `server/` |
| `.claude/` | Claude Code settings and the gh-tasks rules |
| `CHANGELOG.md` | Changes per version |

## Scripts

Locally the server keeps the users and the favourites in the same Firestore as the deployed function, so **local
development changes the real data**. Set it up once, with the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install):

```sh
gcloud auth application-default login   # the Google credentials the Firebase Admin SDK reads
cp server/.env.example server/.env      # GOOGLE_CLOUD_PROJECT, and JWT_SECRET to fill in
```

Without the credentials the server stops at the start and says what to run; without `JWT_SECRET` sign-up and
sign-in answer `500`. The tests mock the store: they need no
credentials and no network.

```sh
npm install           # installs all three packages
npm run dev           # the client (Vite) and the server (port 4310, or PORT) together
npm run build         # type check and production build of the client
npm run build:function -w server  # the server bundled for Firebase, into server/dist
npm run lint          # ESLint, every package
npm run format:check  # Prettier, every package
npm run typecheck     # TypeScript, every package
npm run test          # Vitest, every package
```
