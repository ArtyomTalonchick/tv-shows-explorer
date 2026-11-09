# Genre filter

## Purpose

The user narrows the found shows to one genre, so a long result list can be looked through by what the user is in
the mood for.

## Behaviour

1. When the search has results, a row of chips sits between the heading and the cards: «All» first, then each
   genre of the current results. Each chip shows its number of shows («Drama 5»); «All» shows the number of all
   results.
2. The genres are sorted by their number of shows, the most common first; genres with the same number are in
   alphabetical order.
3. A click on a genre chip keeps only the shows of that genre. The chip is filled with the accent colour, and the
   count in the heading reads «5 of 10 shows · Drama».
4. One genre is selected at a time: a click on another genre switches to it.
5. «All» resets the filter, and so does a click on the selected chip; «All» is filled while no genre is selected.
6. The pagination works on the filtered shows («Shows 4–5 of 5»). A change of the filter opens page 1.
7. A new search resets the filter to «All».

## States

| State | What the user sees |
|---|---|
| Loading | Five chip skeletons above the card skeletons |
| Results, no genre selected | The chips with «All» filled; all the shows |
| A genre selected | That chip filled; its shows; «N of M shows · Genre» in the heading |
| No results, error | No chips |

## Layout

- From the md breakpoint (768 px): the chips wrap onto as many lines as they need.
- Below it: one row that scrolls sideways, from edge to edge of the screen, with no scrollbar.
- The chip skeletons of the loading state are as tall as the chips, so the cards below do not jump when the chips
  replace them. (#13)

## Edge cases

- No show of the results has a genre: the chip row is hidden.
- A show without genres is seen only under «All».
- A show of several genres is counted once under each of them.

## Decisions

- One genre at a time. (#10)
- The filter is reset both by «All» and by a click on the selected chip; the chips are toggle buttons
  (`aria-pressed`). (#10)
- Chips are sorted by their number of shows, then alphabetically, and show their counts, as in the v0.1 mockup.
  (#10)
- With no genres in the results the chip row is hidden. (#10)
- The filter works on the client, on the results TVmaze returned; the genre is kept together with the results it
  was chosen in, so a new search shows all its shows. (#10)
