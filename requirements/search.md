# Search

## Purpose

The user finds TV shows by typing a query. TVmaze does the search
(`https://api.tvmaze.com/search/shows?q=<query>`); the app shows what it finds.

## Behaviour

1. The app opens on the start screen: the hero with the search field only. The field has focus. No request
   is sent.
2. As soon as the field holds a query, the hero gives way to a compact header with the field (it keeps the focus
   and the cursor) and the results area below it, titled «Shows for “<query>”». The change is animated: the field
   and the logo move to the header, the hero fades out and the results area rises in (400 ms). Emptying the field
   plays it backwards. Typing within one screen is not animated; with reduced motion, or in a browser without view
   transitions, the screens swap at once.
3. The query is trimmed. A request goes out once the user has stopped typing for 400 ms, not on every key.
4. A new query cancels the request that is still running. An answer that arrives for an older query is never
   shown.
5. While the next query waits for the debounce and loads, the found shows on screen stay, with their genre and
   page; the spinner in the field shows the request, and the heading keeps naming the query of the shown results.
   The new answer replaces them and opens page 1 with no genre selected.
6. When the answer comes, the results area shows the count («10 shows», «1 show») and the found shows as cards
   by pages (see `results-list.md`), with the genre chips above them (see `genre-filter.md`).
7. The × button in the field and the «Clear search» button empty the field and bring back the start screen.
8. When the request fails, the error state offers Retry; Retry sends the current query again.

## States

| State | What the user sees |
|---|---|
| Idle | The start hero with the search field; no results area |
| Loading | A spinner in the field instead of ×. With no found shows on screen (the first request, or after an empty or failed one): five chip skeletons and three card skeletons in the list. With found shows on screen: they stay as they are |
| Results | The count and the found shows |
| No results | «0 shows» and «Nothing found for “<query>”» with «Clear search» |
| Error | «Could not load shows» with Retry |

## Edge cases

- An empty or whitespace-only query clears the results at once and sends no request.
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
