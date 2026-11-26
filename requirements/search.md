# Search

## Purpose

The user finds TV shows by typing a query. TVmaze does the search
(`https://api.tvmaze.com/search/shows?q=<query>`); the app’s server asks it, and the app shows what it finds.

## Behaviour

1. The app opens on the start screen: the hero with the search field only. The field is not focused. No request
   is sent.
2. As soon as the hero field is tapped or gets the focus (a click, Tab), the hero gives way to the results screen: a
   compact header with the field, which has the focus, and the results area below it. With an empty field the
   area asks for a query (see Idle in States); once the field holds a query, it is titled «Shows for “<query>”».
   The change is animated: the field and the logo move to the header, the hero fades out and the results area
   rises in (400 ms). On a touch screen the keyboard opens on that first tap and stays open, and the page does not
   scroll. Typing within the results screen is not animated; with reduced motion, or in a browser without view
   transitions, the screens swap at once.
3. The query is trimmed. A request to the server goes out once the user has stopped typing for 400 ms, not on every
   key. The server asks TVmaze, filters the found shows by the genre and cuts the page; the browser never calls
   TVmaze. The server keeps TVmaze's answer to a query for 5 minutes: within them the same query — with any genre or
   page — is answered from the cache, without TVmaze; after them TVmaze is asked again and the kept answer replaced.
   A failed answer is not kept, so Retry asks TVmaze again.
4. A new query cancels the request that is still running. An answer that arrives for an older query is never
   shown.
5. While the next query waits for the debounce and loads, the found shows on screen stay, with their genre and
   page, dimmed (see 10), and the heading keeps naming the query of the shown results.
   The new answer replaces them and opens page 1 with no genre selected.
6. When the answer comes, the results area shows the count («10 shows», «1 show») and the found shows as cards
   by pages (see `results-list.md`), with the genre chips above them (see `genre-filter.md`).
7. The × button in the field and the «Clear search» button empty the field and give it the focus back; the results
   screen stays. Deleting the text by hand stays on it too.
8. When the request fails, the error state offers Retry; Retry sends the current query again. Another genre or page
   of the shown results that fails to load does not show it: the shown results stay with their genre and page, and a
   toast says «Couldn’t change the genre» or «Couldn’t load page **3**». (#41)
9. The logo in the header is a button back to the start screen: it resets the query, the results, the genre and the
   page, cancels the request on its way, and plays the change of 2 backwards. Only the logo brings back the start screen; `Esc` and the browser's
   Back do not.
10. While the shown results wait for an answer — to a new query, another genre or another page — nothing in them
    can be pressed or focused, and after 150 ms they dim to half their opacity (at once with reduced motion), so a
    quick answer does not flash. The field stays as it is: the user keeps typing.

## States

| State | What the user sees |
|---|---|
| Start | The start hero with the search field; no results area |
| Idle | The results screen with an empty field: «Search for a show» and «Type a title — results appear as you type.»; no heading, no count |
| Loading | The field keeps its × button. With no found shows on screen (the first request, or after an empty or failed one): five chip skeletons and three card skeletons in the list. With found shows on screen: they stay, dimmed, and cannot be pressed |
| Results | The count and the found shows |
| No results | «0 shows» and «Nothing found for “<query>”» with «Clear search» |
| Error | «Could not load shows» with Retry |

## Edge cases

- An empty or whitespace-only query clears the results at once, shows the Idle state and sends no request.
- Spaces around the query are not sent: « dark » and «dark» are the same search.
- Typing back to the query whose answer is on screen within 400 ms sends no new request and changes nothing on
  screen: the genre, the page and the list stay.
- After the field is emptied, the next query loads with skeletons again.
- Special characters are URL-encoded on the way to the server («doctor who & co» → `q=doctor+who+%26+co`) and to
  TVmaze (`q=doctor%20who%20%26%20co`).
- The server answers 400 to a missing or blank query and to a page that is not a whole number from 1, and 502
  when TVmaze fails or answers a list of a wrong shape; the app shows the error state for both, and for an answer of
  the server of a wrong shape. (#31)
- A show without a rating or a poster comes through with `null` in that field.

## Decisions

- The debounce is 400 ms. (#8)
- The app wakes its server on start: the server scales to zero, so the first request after a pause waits for a cold
  start, and that would be the user's search. The root unit sends `GET /api/health` once, after the first render
  (`App/_logic/_tasks/wakeServer`), and reads nothing from the answer: a failed or slow one shows nothing, and the
  search sends its own request and shows its own error. (#68)
- The query is trimmed before it is sent; a whitespace-only query counts as empty. (#8)
- Retry repeats the current query. (#8)
- Requests are handled by the app's own code (`AbortController`), without a query library. (#8, #16)
- The search goes through the app’s server (`GET /api/shows`), which asks TVmaze, filters by the genre and cuts the
  page; the browser sends no request to TVmaze. The request carries the query, the genre and the page, so a change of
  the genre or the page is a new request; the server cache (#26) keeps it from reaching TVmaze. A request the
  browser cancels cancels the server’s TVmaze request too. TVmaze’s URL and the mapping to `Show` are on the server
  (`server/src/routes/shows/getShows`). In development Vite passes `/api` on to the server. (#25)
- TVmaze's answers are cached in the server's memory for 5 minutes, keyed by the trimmed query; no database. The
  cache is a store of its own, `server/src/routes/_stores/searchCache` — a `Map` on `globalThis`, so a query such as
  «constructor» is not found on an object's prototype — reached only by the tasks `readCachedSearch`,
  `writeCachedSearch` and `dropExpiredSearches`, which `searchTvmaze` calls. An entry 5 minutes old or older is
  expired; before each write the expired entries are dropped, so the cache holds no more than the queries of the
  last 5 minutes. Failed and cancelled requests are not cached. The cache is lost when the server restarts or
  sleeps; that is accepted. (#26)
- The hero and the header swap with a view transition (the browser's View Transitions API, no animation library)
  lasting `durations.slow` (400 ms), a token added for it. (#8)
- Skeletons only when there are no found shows to keep on screen; otherwise the shown results stay until the
  answer to the next query arrives, and the heading names the query of the shown results, not the one in the
  field. While they wait they are dimmed and cannot be pressed (`inert`, `aria-busy`): the dimming comes after
  150 ms, so a quick answer does not flash. (#17, #25)
- The field shows no spinner: it would turn for a change of the genre or the page too, far from the field, and the
  dimmed results already show the wait. The × button stays while a request runs. (#25)
- An emptied field stops the search at once, so the request in flight is cancelled and the same query typed back
  within 400 ms is sent again instead of waiting for the old answer forever. (#20)
- The results screen opens on the focus of the hero field, not on the first letter, and an empty field keeps it:
  clearing to type another query is not a trip through the hero, and on iOS the centred hero field is not
  scrolled above the keyboard before the switch. The hero field is therefore not focused on start — it would open
  the results screen at once. Only the logo brings back the hero; `Esc` and Back are left out. (#18)
- The results screen with an empty field shows a message asking for a query, in the style of the no-results
  state, with no heading. The mockup is in `design/v0.1/` (`idle`, `home`). (#18)
- A tap on the hero field focuses an invisible field, `SearchPage/FocusKeeper`, with `preventScroll`, and the
  screens swap only once the keyboard is open (`lib/screen/waitForKeyboard`: the visual viewport resizes, at most
  600 ms). iOS Safari and the installed app open the keyboard about 80 ms after the tap, and only if the field
  focused in the tap still has the focus then; a swap started at once would take the focus away and leave the
  keyboard closed, so the first tap would need a second one. Chrome on iOS opens it for any focus, which hides the
  problem there. With the keyboard open, the results field takes the focus from the keeper by `autoFocus`, and focus
  moved from one field to another keeps the keyboard open. The keeper is not the hero field, which goes away with
  the swap; it stays mounted on both screens, cannot be reached by Tab and is hidden from screen readers. A click or
  Tab swaps the screens at once, without the keeper. (#18, #21)
- The caret of the results field is hidden while the screens swap and redrawn after (`lib/screen/redrawCaret`): iOS
  draws it flying over the animation and shows none in the field until the first key. A swap with no animation on
  touch screens was turned down. (#18)
- Events call tasks, and no effect watches data to call one. The field, the asked query, genre and page, the request
  on its way and the answer are one Zustand store, `client/src/stores/useSearchStore`. The task `loadShows`
  (`client/src/tasks/search/`) asks for what the store holds through `searchShows` over `lib/http/fetchJson`,
  cancels the request on its way and drops an answer that is not current any more, so the latest call wins; it keeps
  found shows on screen while it loads, and Retry calls it again. (#16, #42)
- The field is one component, `SearchPage/_components/SearchField`, in the hero and in the search bar: its change
  calls `changeQuery`, which stops the search at once for an emptied field, and a `debounce` made once in its
  Presenter, which calls `searchQuery` after 400 ms. (#42)
- Each part of the results reads the search store and calls its task itself; nothing is passed down only for a
  child. `SearchResults` only chooses the state (`getSearchStatus`); the heading, the genre chips, the list,
  «Nothing found» and the error read what they show, and the chips and the pages call `selectGenre` and
  `changePage` and show their own toast. A card gets its show, a favourites row its favorite. (#32, #46)
- The store keeps what the screen reads: `answer` is the answer on screen — `changeQuery` drops an empty or failed
  one as soon as another query is typed, and `searchQuery` asks again for the same query whose answer it dropped —
  and `isLoading` is written by `loadShows`, so no Presenter reads the request. The chips and the pages mark the
  asked genre and page while the shown answer is of the asked query, and the answer's own while a new query waits
  and loads. (#46)
- Which screen is shown is UI state of the search page, `SearchPage/_stores/useScreenStore`. The hero's
  `openResults` plays the swap; the logo calls `clearSearch` inside the transition, which empties the store and
  cancels the request on its way. (#32, #43)
- The × of the field and «Clear search» call `clearSearch` and give the focus back themselves: the × through the
  field's own ref, «Clear search» by `SEARCH_FIELD_ID`, which `SearchField` sets: one id instead of a ref passed
  through three units. (#46)
- A genre or a page that fails to load is rolled back, not shown as an error: `selectGenre` and `changePage` call
  `loadShows({ keepShown: true })`, which on a failure of the current request keeps the shown answer, puts back its
  genre and page, and rejects; the chip or the pages show the toast. A request a later one cancelled rolls nothing
  back. A new query and Retry show the error state. (#41, #46)
