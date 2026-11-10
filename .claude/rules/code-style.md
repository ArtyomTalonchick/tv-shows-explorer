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

- A function declares its return type, so a reader sees what it returns without scrolling to its end. ESLint
  `@typescript-eslint/explicit-function-return-type`; callbacks typed by their place (`onClick={() => …}`,
  `.map(…)`) and tests are left out. (#19)
  - A component is typed by its variable: `export const Chip: FC<ChipProps> = (props) => { … }`, with
    `import type { FC } from "react"`; never `function Name()`. ESLint `no-restricted-syntax`.
  - A hook that returns an object has an exported named type, `UseRequestResult<P, T>`; a `usePresenter` has a
    local `UsePresenterResult`, reusing the props type where it passes props on
    (`Omit<ChipProps, "selected"> & { … }`). A comment on a returned field goes on the type's field.
  - A function inside a hook says it too: `const select = (next: string | null): void => { … }`.

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
- A component that wraps a Chakra element takes that element's props, and declares only what it adds or changes:
  `Omit<HTMLChakraProps<"input">, "value" | "onChange" | "size"> & { value: string; onChange: (value: string) => void; … }`.
  The Presenter passes the rest on (`...inputProps`); the View spreads it after the component's own styles, so a
  caller can change one, and before the attributes the component relies on, so a caller cannot replace them. `ref` is
  declared by hand: Chakra's prop types leave it out. (#18)
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

- A result that can succeed or fail is a flat object with a flag and a nullable field, not a union checked with
  `in`: `{ data: T | null; failed: boolean }`, read as `if (shown.failed)` and `shown?.data ?? []`. (#16)
- What every request repeats — the `AbortController`, the cancel in the effect cleanup, dropping a late answer,
  Retry — lives once in `lib/hooks/useRequest`, not in each request hook; a request hook adds only what is its own
  (debounce, reset). The transport (`fetch`, the non-2xx check, `json()`) is `lib/helpers/fetchJson`. (#16)
- A hook is split until each part has one job, but along real seams: steps of one request stay together, and a
  value computed from state is a plain helper (`getSearchView`), not another hook with state of its own. (#16)

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
