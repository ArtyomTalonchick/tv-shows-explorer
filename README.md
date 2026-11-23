# TV Shows Explorer

A small app to search TV shows from the public [TVmaze API](https://www.tvmaze.com/api): type a query, browse
the results three per page, filter them by genre, and keep the shows you like in your favourites. The app has its
own server: the client never calls TVmaze itself.

**Live:** https://tv-shows-explorer.web.app — on Firebase Hosting; its server answers on the same domain at `/api`
(a Cloud Function on Firebase; the favorites are kept in Firestore).

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
- **Favourites.** A bookmark on every show card adds the show to the favourites or removes it. A toast says what
  was done, with Undo after a removal. The Favourites button on both screens shows how many there are and opens
  their list. The change shows at once and is undone if the server fails.
- **A list per browser, no accounts.** All the favourites logic is on the server. The list is kept in a database
  (Firestore), so it survives a restart of the server.
- **Installable.** The app has its own icon and can be installed on a phone or a desktop.

What each feature does is described in [`requirements/`](requirements/README.md).

## AI Rules

The architecture rules live in their own repository, a Claude Code plugin:
[`claude-simple-architecture`](https://github.com/ArtyomTalonchick/claude-simple-architecture).
This version is built by the rules of
[`v0.3.0`](https://github.com/ArtyomTalonchick/claude-simple-architecture/tree/v0.3.0). The client and the server
both follow them: the same levels, tasks and stores on each side.

In this repository:

- [`CLAUDE.md`](CLAUDE.md) — the project instructions for the agent;
- [`.claude/simple-architecture/config.json`](.claude/simple-architecture/config.json) — where the plugin finds the
  client and the server, and the folder names;
- [`.claude/rules/`](.claude/rules/) — the project's code style and its exceptions from the plugin's rules;
- [`.claude/gh-tasks/rules.md`](.claude/gh-tasks/rules.md) — how a task is picked, built, checked and released
  (run with the gh-tasks plugin for Claude Code).

## Stack

An npm workspaces monorepo in TypeScript:

- **Client:** React 19, Chakra UI v3, Zustand, Vite, Vitest with Testing Library; served by Firebase Hosting.
- **Server:** Node, Hono, Vitest; a Cloud Function on Firebase, with the favorites in Firestore.
- **Tooling:** ESLint and Prettier for the whole repository.

## Repository layout

| Path | What it is |
|---|---|
| `client/` | The app (Vite, React); deployed to Firebase Hosting |
| `server/` | The API server (Hono); deployed to Firebase as a Cloud Function |
| `shared/` | The API types the client and the server share: types only |
| `design/` | Design tokens, mockups and screenshots of each version |
| `requirements/` | What each feature does: the source of truth for the code |
| `.github/workflows/` | CI (lint, format, type check, tests of every package), and the deploy of the client and the server to Firebase; the deploy needs the secret `FIREBASE_SERVICE_ACCOUNT` |
| `firebase.json`, `.firebaserc` | The Firebase project: the Hosting of the client, which hands `/api/**` to the Cloud Function built from `server/` |
| `.claude/` | Claude Code settings and the gh-tasks rules |
| `CHANGELOG.md` | Changes per version |

## Scripts

Locally the server keeps the favorites in the same Firestore as the deployed function, so **local development
changes the real data**. Set it up once, with the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install):

```sh
gcloud auth application-default login   # the Google credentials the Firebase Admin SDK reads
cp server/.env.example server/.env      # GOOGLE_CLOUD_PROJECT, the Firebase project id
```

Without them the server stops at the start and says what to run. The tests mock the store: they need no
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
