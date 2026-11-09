# Code style

The owner's preferences for code, collected task by task. Where a linter can hold a rule, it does; the rest is
followed by hand. A new preference the owner states during a task is added here when the task closes (see
`## Close` in `.claude/gh-tasks/rules.md`), with the issue it came from.

## Formatting (Prettier + ESLint)

- Prettier formats the code; lines up to 120 characters. A tag, parameter list, destructuring or object that does
  not fit goes one item per line. (#8)
- `if` / `else` always have a block, and the body is on its own line; no inline `if (x) return;`. ESLint `curly`. (#8)
- `async` / `await` with `try` / `catch`, never `.then` chains. ESLint `promise/prefer-await-to-then`. (#8)
- A component always has a body: `=> { return (…); }`, so adding a Presenter later changes one line. ESLint
  `no-restricted-syntax`. (#8)

## Code

- `const` over `let`. A value chosen by several branches is an IIFE with early returns, not a `let` reassigned in
  `if` / `else`: (#8)

  ```ts
  const status = ((): SearchStatus => {
    if (query === "") {
      return "idle";
    }
    return "loading";
  })();
  ```

- Stateful logic is split by concern: the state of a control (value, handler, clear) and a request (debounce,
  cancellation, retry) are separate hooks, joined in the Presenter. (#8)
- One component per screen and per state (loading, list, empty, error); the parent only chooses which to render. (#8)

## Styles

- Styles come from the theme: Chakra recipes and slot recipes for components, text styles for text. Components do
  not carry long lists of style props. (#8)
- An asset has one source: icons are the design sprite, not copies of its paths in code. (#8)

## Imports and files

- `@/` is `src/`. Code of the own folder and own children is imported relatively; anything further through `@/`. (#8)
- Tests live in `__tests__/` next to the code they test, never beside source files. A test imports the code of the
  folder that holds `__tests__/` relatively (`../useShowsRequest`), anything else through `@/`. (#8)

## Tools

- Familiar, standard tools over clever ones: Prettier and ESLint presets, the browser's View Transitions API
  rather than an animation library for one transition. (#8)
