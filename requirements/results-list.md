# Results list

## Purpose

The shows TVmaze finds are shown as cards, three per page, so the user can look through them a page at a time.

## Behaviour

1. When the search has results, the results area shows the cards of page 1 below the heading and the count.
2. A card shows the poster with the rating on it, the show's name, and one line of details: the years and the
   genres («2017–2020 · Drama, Science-Fiction»).
3. A click on a card opens the show's page on TVmaze in a new tab.
4. Below the cards, the pagination shows ‹, a button per page and ›, and the line «Shows 1–3 of 9». The current
   page is filled. A click on a page button, ‹ or › shows that page.
5. When the user switches the page and the start of the cards is above the screen (the pagination is at the
   bottom of a long page on mobile), the page scrolls to the top, so the new cards are seen from the first one.
   The scroll is smooth, or instant with reduced motion.
6. A new search result opens page 1, and so does a change of the genre filter: the list shows the shows of the
   selected genre (see `genre-filter.md`).

## States

| State | What the user sees |
|---|---|
| One page (1–3 shows) | The cards, no pagination |
| Several pages | The cards of the current page and the pagination |
| First page | ‹ is turned off |
| Last page | › is turned off; the last page may hold fewer than three cards |

The loading, no-results and error states belong to the search: see `search.md`.

## Layout

- From the md breakpoint (768 px): three cards in a row, the poster above the name.
- Below it: one card per row, a small poster on the left and the name and details beside it.
- The card skeletons of the loading state keep the same layout as the cards, so the cards replace them without a
  jump. (#13)

## Edge cases

- No poster: a placeholder with a film icon and «No poster» in its place.
- No rating: no badge on the poster.
- The years: «2008–2019»; «2019» when a show began and ended in one year; «2022–» while it still runs; left out
  when the premiere date is unknown. No genres: only the years. Neither: an empty line.
- A whole rating keeps its decimal: «★ 8.0».
- A page holding one show reads «Shows 10 of 10».
- Two shows with the same name (TVmaze has two «Dark Matter») are two cards.

## Decisions

- Paging is done on the client: TVmaze search returns all its results (at most 10) in one response. (#9)
- Every page gets a button; the «…» gap of the design library is not used, as 10 results make at most 4 pages. (#9)
- A card links to the show's page on TVmaze, in a new tab, until the app has a show page of its own. (#9)
- Switching the page scrolls to the top when the start of the cards is above the screen. (#9)
- The page is kept together with the list it belongs to, so a new list (a new search, later a genre filter)
  opens page 1. (#9)
