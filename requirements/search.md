# Search

## Purpose

The user finds TV shows by typing a query. TVmaze does the search
(`https://api.tvmaze.com/search/shows?q=<query>`); the app shows what it finds.

## Behaviour

1. The app opens on the start screen: the hero with the search field only. The field is not focused. No request
   is sent.
2. As soon as the hero field gets the focus (a tap, a click, Tab), the hero gives way to the results screen: a
   compact header with the field, which has the focus, and the results area below it. With an empty field the
   area asks for a query (see Idle in States); once the field holds a query, it is titled «Shows for “<query>”».
   The change is animated: the field and the logo move to the header, the hero fades out and the results area
   rises in (400 ms). On a touch screen the keyboard opens on that first tap and stays open, and the page does not
   scroll. Typing within the results screen is not animated; with reduced motion, or in a browser without view
   transitions, the screens swap at once.
3. The query is trimmed. A request goes out once the user has stopped typing for 400 ms, not on every key.
4. A new query cancels the request that is still running. An answer that arrives for an older query is never
   shown.
5. While the next query waits for the debounce and loads, the found shows on screen stay, with their genre and
   page; the spinner in the field shows the request, and the heading keeps naming the query of the shown results.
   The new answer replaces them and opens page 1 with no genre selected.
6. When the answer comes, the results area shows the count («10 shows», «1 show») and the found shows as cards
   by pages (see `results-list.md`), with the genre chips above them (see `genre-filter.md`).
7. The × button in the field and the «Clear search» button empty the field and give it the focus back; the results
   screen stays. Deleting the text by hand stays on it too.
8. When the request fails, the error state offers Retry; Retry sends the current query again.
9. The logo in the header is a button back to the start screen: it resets the query, the results, the genre and the
   page, and plays the change of 2 backwards. Only the logo brings back the start screen; `Esc` and the browser's
   Back do not.

## States

| State | What the user sees |
|---|---|
| Start | The start hero with the search field; no results area |
| Idle | The results screen with an empty field: «Search for a show» and «Type a title — results appear as you type.»; no heading, no count |
| Loading | A spinner in the field instead of ×. With no found shows on screen (the first request, or after an empty or failed one): five chip skeletons and three card skeletons in the list. With found shows on screen: they stay as they are |
| Results | The count and the found shows |
| No results | «0 shows» and «Nothing found for “<query>”» with «Clear search» |
| Error | «Could not load shows» with Retry |

## Edge cases

- An empty or whitespace-only query clears the results at once, shows the Idle state and sends no request.
- Spaces around the query are not sent: « dark » and «dark» are the same search.
- Typing back to the query whose answer is on screen within 400 ms sends no new request and changes nothing on
  screen: the genre, the page and the list stay.
- After the field is emptied, the next query loads with skeletons again.
- Special characters are URL-encoded («doctor who & co» → `q=doctor%20who%20%26%20co`).
- A show without a rating or a poster comes through with `null` in that field.

## Decisions

- The debounce is 400 ms. (#8)
- The query is trimmed before it is sent; a whitespace-only query counts as empty. (#8)
- Retry repeats the current query. (#8)
- Requests are handled by the app's own code (`useEffect` + `AbortController`), without a query library. (#8)
- TVmaze is asked through an API layer with no React in it: `SearchPage/searchShows` (the TVmaze URL and the
  mapping to `Show`) over `lib/helpers/fetchJson` (`fetch`, the non-2xx check, `json()`). The caller passes the
  `AbortSignal`; debounce, cancellation and Retry stay in `useShowsRequest`. (#16)
- Cancelling a request, dropping a late answer and Retry are done by the shared hook `lib/hooks/useRequest`, made
  now although search is its only user, so the next request does not repeat them. `useShowsRequest` adds the
  debounce and drops the answer when the field is emptied; `getSearchView`, a plain function, decides what the
  results area shows. (#16)
- The hero and the header swap with a view transition (the browser's View Transitions API, no animation library)
  lasting `durations.slow` (400 ms), a token added for it. (#8)
- Until the results list (#9) brings the show cards, the results state shows a plain list of show names. (#8)
  The cards and pagination replaced it in #9. (#9)
- Skeletons only when there are no found shows to keep on screen; otherwise the shown results stay until the
  answer to the next query arrives, and the heading names the query of the shown results, not the one in the
  field. The old results are not dimmed. (#17)
- An emptied field passes the debounce at once, so the request in flight is cancelled and the same query typed
  back within 400 ms is sent again instead of waiting for the old answer forever. (#20)
- The results screen opens on the focus of the hero field, not on the first letter, and an empty field keeps it:
  clearing to type another query no longer means a trip through the hero, and on iOS the centred hero field is
  not scrolled above the keyboard before the switch. The hero field is therefore not focused on start — it would
  open the results screen at once. Only the logo brings back the hero; `Esc` and Back are left out. (#18)
- The results screen with an empty field shows a message asking for a query, in the style of the no-results
  state, with no heading. The mockup is in `design/v0.1/` (`idle`, `home`). (#18)
- A tap on the hero field focuses it from the tap handler with `preventScroll`, instead of the browser's own
  focus. iOS opens the keyboard only for a focus set inside the tap, and scrolls a centred field above the
  keyboard: the scroll played under the transition, and a focus set after the transition left the keyboard
  closed. The field of the results screen then takes the focus while the keyboard is open. Its caret is hidden
  until the transition has finished and then redrawn (`lib/helpers/redrawCaret`): iOS drew it flying over the
  animation and showed none in the field until the first key. Hidden fields to hold the focus, and a swap with no
  animation on touch screens, were turned down. (#18)
