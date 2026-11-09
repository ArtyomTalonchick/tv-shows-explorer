# Requirements

What the app does, feature by feature. These files are the source of truth: when an issue, a mockup or the code
contradicts them, the question goes to the owner, and the answer is recorded under **Decisions** in the
feature file.

## Product

TV Shows Explorer searches TV shows with the public [TVmaze API](https://www.tvmaze.com/api)
(`https://api.tvmaze.com/search/shows?q=<query>`).

- **Search.** The app starts with an empty list and a search field. The query goes to TVmaze, which does the
  filtering.
- **List and pagination.** Results are shown as cards, three per page; the user switches between pages.
- **Genre filter.** The unique genres of the current results are shown as chips above the list. A chip keeps
  only the shows of that genre; the filter can be reset to all results.

Each feature gets its own file here once a task builds or changes it.

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
| **Decisions** | Questions that came up and how they were decided, with the issue number |

Template:

```md
# <Feature>

## Purpose

## Behaviour

## States

## Edge cases

## Decisions
```
