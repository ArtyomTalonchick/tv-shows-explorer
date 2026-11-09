# Design

The design of TV Shows Explorer lives in git next to the code. The code is built from it, not the other way round.

## Direction: «Premiere» (v0.0)

A dark, cinematic, hero-centric look, based on the
[Hero-centric design](https://www.uistyleguide.com/style/hero-centric-design) style:

- **Dark theme only.** There is no light theme.
- **Hero where it sells, a calm grid where you work.** The start screen and the top of a show page are
  full-viewport heroes. Search results are a plain poster grid: a full-screen hero on every screen would make a
  catalogue hard to use.
- **The poster is the backdrop.** TVmaze gives portrait posters only, with no wide stills, so a hero background
  is the same poster, blurred and darkened. The sharp poster sits next to the title.
- **One accent.** Ember orange `#FF6B35` marks CTAs, eyebrows and ratings, and nothing else.
- **Archivo**, from regular to black: an oversized display headline (`clamp()`), a small uppercase eyebrow
  above it, and one short sentence below.

Contrast (WCAG AA): primary text 17.7:1, secondary text 7.7:1, accent text 6.8:1, text on the accent 7.0:1.

## Files

| Path | What it is |
|---|---|
| `tokens.json` | Design tokens: colours, typography, spacing, sizes, radii, shadows, blurs, motion |
| `v0.0/mockup.html` | The mockup of v0.0, built on `tokens.json` |
| `v0.0/screens/*.png` | Screenshots of the mockup: desktop 1440px and mobile 390px, full page and first screen |
| `library/components.css` | The component library: the styles of every UI component, built on the tokens only |
| `library/library.js` | Loads the library into a page: `tokens.json` as CSS variables and `icons.svg` as an inline sprite; the showcase and every mockup from v0.1 load it |
| `library/icons.svg` | The line icons (24×24, `currentColor`) as an SVG sprite; use `<svg class="icon"><use href="#search"/></svg>` |
| `library/index.html` | The showcase: each component in all its variants and states |
| `library/screens/*.png` | Screenshots of the showcase: desktop 1440px and mobile 390px |
| `v0.1/mockup.html` | The search screen of v0.1 in every state, built from the library |
| `v0.1/screens/*.png` | One screenshot per state: `desktop-<state>.png` (1440px) and `mobile-<state>.png` (390px) |
| `icon/` | The app icon: `icon.svg`, `icon-maskable.svg` and their PNG exports |

## Tokens

`tokens.json` has the shape of a Chakra UI v3 theme, so the app theme is made from it directly:

```ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import tokens from "../design/tokens.json";

const config = defineConfig({
  theme: { tokens: tokens.tokens, semanticTokens: tokens.semanticTokens },
});
export const system = createSystem(defaultConfig, config);
```

- `tokens` are raw values: the palettes `ink` (neutrals) and `ember` (the accent), fonts, the type scale and
  the rest.
- `semanticTokens` are roles: `bg`, `bg.subtle`, `fg`, `fg.muted`, `border`, `accent.solid`, `accent.contrast`…
  Components use roles, never raw colours (`color="fg.muted"`, not `color="ink.300"`).
- The names `bg`, `fg` and `border` replace Chakra's own semantic tokens. Since the app is dark only, every
  role has one value and no `_dark` condition. The app still forces the dark colour mode (the `dark` class on
  `<html>`), so the Chakra semantic tokens this file does not override (`bg.panel`, `fg.error`…) take their dark
  values too.

A change to a colour or size goes into `tokens.json` first. The mockup and the app both pick it up.

## The mockup

`v0.0/mockup.html` reads `../tokens.json` at load time and turns every token into a CSS variable:
`--colors-ink-950`, `--colors-accent-solid`, `--fontSizes-display`, `--radii-md`. A reference like
`{colors.ink.950}` becomes `var(--colors-ink-950)`. The mockup has no colours or sizes of its own.

`fetch` does not work from `file://`, so open it through a local server:

```sh
npx http-server design
# then open http://localhost:8080/v0.0/mockup.html
```

VS Code Live Server works too: open `design/library/index.html` or `design/v0.1/mockup.html` with it.

It shows the start screen, search results (including a show with no poster and no rating), a show page, and
the tokens themselves. Posters are loaded from TVmaze.

## The library

`library/` is the design side of the UI kit in `src/lib/components/`: one class (or block of classes) here is one
component there. A component goes into the code when the first implementation task needs it.

| Component | Classes | Variants and states |
|---|---|---|
| Text | `.eyebrow`, `.display`, `.title`, `.lead`, `.logo` | — |
| Button | `.btn`, `.btn--ghost`, `.btn--sm` | default, hover, active, focus, disabled |
| SearchInput | `.search-input`, `.search-input--sm`, `__clear` | empty, hover, focus with text and clear (×), loading (spinner), disabled |
| Chip | `.chip`, `.chip--selected` / `aria-pressed`, `__count` | default, hover, active, focus, selected, disabled |
| ShowCard | `.show-card`, `__poster`, `__rating`, `__no-poster`, `__name`, `__meta` | default, hover, no rating, no poster |
| Pagination | `.pagination`, `__item` / `aria-current`, `__gap`, `__info` | current, hover, disabled arrows, a gap |
| Skeleton, Spinner | `.skeleton--poster`, `--line`, `--line-short`, `--chip`, `.spinner`, `.spinner--lg` | — |
| EmptyState, ErrorState | `.state`, `.state--error`, `__icon`, `__title`, `__text` | — |

Rules:

- `components.css` uses only the CSS variables of `tokens.json`. A value it needs and the tokens lack goes into
  `tokens.json` first.
- The pointer states are drawn statically with `.is-hover`, `.is-active` and `.is-focus`, so the showcase and
  its screenshots show them.
- `icons.svg` and `library.js` stay ASCII-only, and no comment in an SVG holds a closing `svg` tag. VS Code
  Live Server injects its reload script before the first closing `svg` tag of a served SVG and miscounts
  multi-byte characters; either one breaks the sprite and every icon renders empty.
- A mockup links `../library/components.css`, `../library/library.js` and the favicon `../icon/favicon-32.png`, and draws no components of its own:
  its own CSS is page layout only (screens, header, hero, grid).

## The icon

`icon/icon.svg` is the source: the slash of the `tv/explorer` logo in ember (`ember.500`) on the page
background (`ink.950`) with the accent glow. `icon-maskable.svg` has a full-bleed background; the glyph stays
inside the safe zone (a centred circle of 40% radius), so the platform may cut any shape.

| File | Use |
|---|---|
| `favicon-32.png` | favicon |
| `apple-touch-icon-180.png` | iOS home screen |
| `icon-192.png`, `icon-512.png` | PWA manifest, `purpose: any` |
| `icon-maskable-512.png` | PWA manifest, `purpose: maskable` |

The PNGs are exported from the SVGs (rendered in a browser at the exact size); a change to an SVG re-exports them.

## Process

1. **Every milestone starts with a design task.** It has the `design` label and touches no app code.
2. **Directions first.** For a new look, 2–3 directions are shown and the user picks one. Only the chosen
   direction is committed; the rejected ones are not kept.
3. **Mockups and screenshots go into git:** `design/v0.N/*.html` and `design/v0.N/screens/*.png`, so the history
   of the design is in the repository and can be read on GitHub without running anything.
4. **Tokens are shared with the code.** A later milestone may change `tokens.json`; its mockup shows the change.
5. **Library first, then the mockup.** Every design task first adds or changes the library components it needs
   (with their states in `library/index.html` and new screenshots), then builds the mockup from them.
6. **Implementation follows the design.** The feature tasks of the milestone are built from the approved
   mockup and the tokens.
