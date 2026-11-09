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

## Sprint process

One sprint = one version (a GitHub milestone `v0.N`). `v0.0` is a clean start: the scaffold, CI, deploy and the
process itself.

Every sprint goes through five stages:

1. **Rules.** The architecture rules for the sprint are written down and released in
   [`claude-simple-architecture`](https://github.com/ArtyomTalonchick/claude-simple-architecture); the project
   updates the plugin.
2. **Tasks.** The sprint's scope is split into GitHub Issues and planned as a milestone.
3. **Design.** The first task of every milestone is its design. It touches no app code; the mockup and its
   screenshots go into git under [`design/`](design/README.md).
4. **Implementation.** The other tasks are built from the mockup, the `requirements/` files and the
   architecture rules, and checked by lint, type checking and tests.
5. **Release.** The milestone is released as a tag and a GitHub Release, and deployed to GitHub Pages. Fixes
   after review go into `v0.N.1`.

The tasks are run with the gh-tasks plugin for Claude Code; its project rules are in
[`.claude/gh-tasks/rules.md`](.claude/gh-tasks/rules.md). Changes per version are in
[`CHANGELOG.md`](CHANGELOG.md).

## AI Rules

The architecture rules live in their own repository, a Claude Code plugin:
[`claude-simple-architecture`](https://github.com/ArtyomTalonchick/claude-simple-architecture).
Its versions follow the project's: this version uses
[`v0.1.0`](https://github.com/ArtyomTalonchick/claude-simple-architecture/tree/v0.1.0).

In this repository:

- [`CLAUDE.md`](CLAUDE.md) — the project instructions for the agent;
- [`.claude/gh-tasks/rules.md`](.claude/gh-tasks/rules.md) — the sprint process as rules for each step of a task.

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

## Scripts

```sh
npm install
npm run dev        # dev server
npm run build      # type check and production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run test       # Vitest
```
