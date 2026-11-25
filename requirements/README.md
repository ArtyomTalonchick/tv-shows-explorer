# Requirements

What the app does, feature by feature. These files are the source of truth: when an issue, a mockup or the code
contradicts them, the question goes to the owner, and the answer is recorded under **Decisions** in the
feature file.

## Product

TV Shows Explorer searches TV shows with the public [TVmaze API](https://www.tvmaze.com/api)
(`https://api.tvmaze.com/search/shows?q=<query>`). The browser asks the app’s own server
(`GET /api/shows?q=<query>&genre=<genre>&page=<page>`), and the server asks TVmaze. (#25)

- **Search.** The app starts with an empty list and a search field. The query goes through the server to TVmaze,
  which does the search.
- **List and pagination.** Results are shown as cards, three per page; the user switches between pages.
- **Genre filter.** The unique genres of the current results are shown as chips above the list. A chip keeps
  only the shows of that genre; the filter can be reset to all results.
- **Accounts.** A visitor signs up and signs in with an email and a password; the session is a pair of tokens the
  browser keeps. The email is not verified, there is no password reset, and a token cannot be revoked before it
  expires. (#61, #62, #69)
- **Favorites.** A signed-in user keeps shows in a list on the server, the same on every device; a guest who
  bookmarks a show or opens the list is asked to sign in. (#27, #63, #64)
- **Installable.** The app has an icon and installs on a phone or a desktop from its web manifest. It does not
  work offline: there is no service worker, so without a network it neither opens nor searches. (#11)

Each feature gets its own file here once a task builds or changes it.

## Pages

Each page has its own address; a direct visit to it opens that page, and the browser's Back and Forward move
between the pages. (#60)

| Address | Page |
|---|---|
| `/` | The search: the start screen, and the results screen once the field is focused. The two screens share the address. |
| `/sign-in` | Sign in. |
| `/sign-up` | Sign up. |

Any other address leads to the search and is replaced by `/`.

## Feature files

One file per feature: `requirements/<feature>.md`, named in kebab case (`search.md`, `genre-filter.md`). A task
that changes a feature updates its file in the same commit.

Every file has these sections:

| Section | What goes there |
|---|---|
| **Purpose** | Why the feature exists, in one or two sentences |
| **Behaviour** | What the user does and what the app does in reply, step by step |
| **States** | Every state the user can see: empty, loading, results, error… |
| **Edge cases** | Unusual input or data and what happens then |
| **Decisions** | The decisions in force and their reasons, with the issue numbers |

A file says only what holds now, with no history: a decision a later task changes is rewritten in place, with the
numbers of both issues, not kept with «Replaced in #N». History lives only in `CHANGELOG.md`.

Template:

```md
# <Feature>

## Purpose

## Behaviour

## States

## Edge cases

## Decisions
```
