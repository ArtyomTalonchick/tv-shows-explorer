# TV Shows Explorer

A small app to search TV shows with the public [TVmaze API](https://www.tvmaze.com/api): type a query, browse
the results three per page, and filter them by genre.

**Live:** https://artyomtalonchick.github.io/tv-shows-explorer/

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
[`v0.1.0`](https://github.com/ArtyomTalonchick/claude-simple-architecture/tree/v0.1.0).

In this repository:

- [`CLAUDE.md`](CLAUDE.md) — the project instructions for the agent;
- [`.claude/gh-tasks/rules.md`](.claude/gh-tasks/rules.md) — how a task is picked, built, checked and released
  (run with the gh-tasks plugin for Claude Code).

## Stack

React 19, TypeScript, Chakra UI v3, Zustand, Vite, Vitest with Testing Library, ESLint.

## Repository layout

| Path | What it is |
|---|---|
| `src/` | The app |
| `design/` | Design tokens, mockups and screenshots of each version |
| `requirements/` | What each feature does: the source of truth for the code |
| `.github/workflows/` | CI (lint, type check, tests) and the GitHub Pages deploy |
| `.claude/` | Claude Code settings and the gh-tasks rules |
| `CHANGELOG.md` | Changes per version |

## Scripts

```sh
npm install
npm run dev        # dev server
npm run build      # type check and production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # Vitest
```
