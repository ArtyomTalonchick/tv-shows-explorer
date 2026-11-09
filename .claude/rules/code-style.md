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
- A Presenter hands a child its props ready, typed by the child's props type, and the View spreads them; the View
  does not take values apart only to put them back together: (#9)

  ```ts
  const pagination: PaginationProps | null = pageCount > 1 ? { page, perPage, total, onPageChange } : null;
  // View: {pagination && <Pagination {...pagination} />}
  ```

- Styles that depend on a variant (`size`, `tone`) are a table in the Presenter, checked with `satisfies Record<…>`
  whose keys come from the props type and whose values are Chakra prop types, not only `as const`: a misspelt
  style or a missing variant is then a type error. Values are not checked against the tokens (no `strictTokens`);
  the editor's hints are enough. (#12)

  ```ts
  type Size = NonNullable<SearchInputProps["size"]>;
  const SIZE_STYLES = {
    md: { root: { py: "3" }, input: { fontSize: "lg" } },
    sm: { root: { py: "2" }, input: { fontSize: "md" } },
  } satisfies Record<Size, { root: HTMLChakraProps<"label">; input: HTMLChakraProps<"input"> }>;
  // View: <chakra.label … {...sizeStyles.root}>
  ```

## Styles

- A component's styles are style props in its own JSX, not a recipe in the theme. A style repeated inside a
  component becomes a child component (`Pagination/PageButton`), not a shared style object. (#9)
- The theme holds only what is global: tokens, text styles, global CSS, and overrides of Chakra's own components
  (button, skeleton, spinner). (#9)
- An asset has one source: icons are the design sprite, not copies of its paths in code. (#8)

## Imports and files

- `@/` is `src/`. Code of the own folder and own children is imported relatively; anything further through `@/`. (#8)
- Tests live in `__tests__/` next to the code they test, never beside source files. A test imports the code of the
  folder that holds `__tests__/` relatively (`../useShowsRequest`), anything else through `@/`. (#8)

## Tools

- Familiar, standard tools over clever ones: Prettier and ESLint presets, the browser's View Transitions API
  rather than an animation library for one transition. (#8)
