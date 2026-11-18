# TV Shows Explorer

A small app to search TV shows with the public [TVmaze API](https://www.tvmaze.com/api): type a query, browse
the results three per page, and filter them by genre.

**Live:** https://artyomtalonchick.github.io/tv-shows-explorer/ — its server answers at
https://us-central1-tv-shows-explorer.cloudfunctions.net/server/api (a Cloud Function on Firebase; the favorites are
kept in Firestore).

The app is built step by step on the Simple Architecture approach. The architecture rules written along the way
are turned into AI rules (see [AI Rules](#ai-rules)).

## Features

- **Search.** The app starts with an empty list and a search field. The query goes to TVmaze, which does the
  filtering.
- **List and pagination.** Results are shown as cards, three per page, with page switching.
- **Genre filter.** The genres of the current results are shown as chips above the list. A chip keeps only the
  shows of that genre; the filter can be reset.

What each feature does is described in [`requirements/`](requirements/README.md).

## AI Rules

The architecture rules live in their own repository, a Claude Code plugin:
[`claude-simple-architecture`](https://github.com/ArtyomTalonchick/claude-simple-architecture).
Its versions follow the project's: this version uses
[`v0.2.1`](https://github.com/ArtyomTalonchick/claude-simple-architecture/tree/v0.2.1).

In this repository:

- [`CLAUDE.md`](CLAUDE.md) — the project instructions for the agent;
- [`.claude/gh-tasks/rules.md`](.claude/gh-tasks/rules.md) — how a task is picked, built, checked and released
  (run with the gh-tasks plugin for Claude Code).

## Stack

An npm workspaces monorepo in TypeScript:

- **Client:** React 19, Chakra UI v3, Zustand, Vite, Vitest with Testing Library.
- **Server:** Node, Hono, Vitest; a Cloud Function on Firebase, with the favorites in Firestore.
- **Tooling:** ESLint and Prettier for the whole repository.

## Repository layout

| Path | What it is |
|---|---|
| `client/` | The app (Vite, React); deployed to GitHub Pages |
| `server/` | The API server (Hono); deployed to Firebase as a Cloud Function |
| `shared/` | The API types the client and the server share: types only |
| `design/` | Design tokens, mockups and screenshots of each version |
| `requirements/` | What each feature does: the source of truth for the code |
| `.github/workflows/` | CI (lint, format, type check, tests of every package), and the deploy of the client to GitHub Pages and of the server to Firebase |
| `firebase.json`, `.firebaserc` | The Firebase project and its Cloud Function, built from `server/` |
| `.claude/` | Claude Code settings and the gh-tasks rules |
| `CHANGELOG.md` | Changes per version |

## Scripts

Locally the server keeps the favorites in memory: it uses Firestore only on Firebase, so no key or setup is
needed.

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
