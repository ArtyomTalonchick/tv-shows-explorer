# Favorites

## Purpose

The user keeps the shows they want to come back to in one list.

## Behaviour

All the favorites logic is on the server; the client shows the list and sends the user's clicks. (#27)

1. Each user has their own list, the same on every device and after signing out and in again. Every
   `/api/favorites` request carries the user's access token (`Authorization: Bearer`, `auth.md`); a guest has no
   list and the routes answer them `401`. (#63)
2. `GET /api/favorites` answers the user's list (`Favorite[]`), the newest first.
3. `PUT /api/favorites/:id` adds the show with this TVmaze id and answers that one `Favorite`; a show already there
   is answered as it is. (#40) The server takes the show from
   the answers of the searches it keeps (`search.md`); a show it has not seen is asked of TVmaze
   (`GET https://api.tvmaze.com/shows/:id`).
4. A favorite keeps what the list shows — id, name, genres, years, poster, the TVmaze link — and the time it was
   added, so the list needs no TVmaze request.
5. `DELETE /api/favorites/:id` removes the show and answers `204 No Content`. `GET` is the only request that answers
   the whole list; after a change the client puts the answered favorite in its place by `addedAt`, or removes the
   show by id. (#40)
6. `PUT /api/favorites/:id` carries the `addedAt` the show is added with (`{ "addedAt": 1763300000000 }`). A show
   put back after a removal sends the `addedAt` of the removed favorite and comes back to its old place in the
   list; a new one sends the browser's time. Without a body the show is added now, at the top. (#56)
7. The search results (`GET /api/shows`) do not say which shows are favorites: the client checks the ids against the
   list it holds.

What the user sees (`design/v0.2/`): (#28)

8. The client loads the user's list when the app starts and right after a sign-in or a sign-up; a guest's list is
   empty and is not asked for. Sign out empties it at once, as does a refused session (`auth.md`). (#63) Both
   screens show the **Favourites** button with the number of favorites, 0 too: in the hero's top-right corner,
   opposite the logo, and at the end of the search bar (on a phone, on the first row with the logo). A guest's
   button has no number. (#64)
9. Every show card has a bookmark — a bookmark, not a star: the star marks the rating. It is filled in the accent
   while the show is a favorite; on a phone it sits at the right end of the row. A press adds or removes the show.
10. The bookmark, the counter and the list change at once, on the press, and the request goes in the background; the
    bookmark can be pressed again at any time. A toast says what was done for 4 s, at once too: «Added **Dark** to
    favourites», or «Removed **Dark** from favourites»; there is no Undo, the bookmark is pressed again (#56).
    If the server answers an error, the bookmark, the counter and the list go back to how they were, and a toast
    says so: «Couldn’t add **Dark** to favourites» (or remove). (#41)
11. The button opens the list in a drawer from the right, full width on a phone: «Your list · Favourites N», a row
    per show, the newest first, with its poster, name, years and genres; the row leads to the show on TVmaze. The
    bookmark of a row removes the show at once, with no toast: the row stays in its place, dimmed, with «Removed» in
    place of the years and genres and an empty bookmark, «Put **Dark** back in favourites». A second press puts the
    show back in its old place (6). The counters drop at once, and the removed rows are gone the next time the list
    opens. Only a failure has a toast. (#56) The backdrop, × and Escape close the drawer; a press on a toast does not.
12. Two quick presses on one bookmark are both kept: a failure of the first one does not undo the second. (#41)
13. A guest is asked to sign in (`design/v0.3/`): (#64)
    - a press on a bookmark sends nothing and leaves it empty; a toast says «Sign in to keep **Dark** in your
      favourites», with a «Sign in» link to `/sign-in`;
    - once the guest signs in or signs up, the show they pressed last is added on its own, after their list loads,
      with no toast; one already in their list changes nothing. A guest who comes back to the search without
      signing in, or reloads the page, adds nothing later; (#67)
    - the drawer opens as for a user, with no number in its title and no list: «Sign in to keep favourites», «Your
      list is kept with your account, on every device.», a «Sign in» button and «No account yet? Sign up». Both
      links close the drawer.

## States

| State | What the server answers |
|---|---|
| No favorites | `GET` answers `[]`; `DELETE` still answers 204 |
| Favorites | `GET` answers the user's whole list, the newest first; `PUT` the one `Favorite`; `DELETE` 204 (#40) |
| No access token, or not a valid one (a guest) | 401, nothing changes (#63) |
| A wrong id (not a whole number from 1) or body | 400, nothing changes |
| TVmaze has no show with the id | 404, nothing changes |
| TVmaze does not answer | 502, nothing changes |

| State | What the user sees (#28) |
|---|---|
| No favorites | The counter shows 0 in a grey badge; the drawer says «No favourites yet» and how to add a show |
| Favorites | The counter in the accent; filled bookmarks on their cards; a row per show in the drawer |
| A change on its way | The bookmark, the counter and the list already show it; the bookmark answers every press (#41) |
| Added, removed | A toast with the show's name, with no Undo (#56) |
| Removed inside the list | The row stays, dimmed, with «Removed» and an empty bookmark that puts it back; no toast; gone when the list opens again (#56) |
| A change failed | The bookmark, the counter and the list go back; «Couldn’t add **Dark** to favourites» (or remove) in a toast (#41) |
| The list did not load | «Couldn’t load your favourites» in a toast with Retry; the counter shows 0 meanwhile |
| A guest | No counter on the button or in the drawer's title, and no bookmark is filled; a press on a bookmark sends nothing and asks to sign in in a toast; the drawer asks to sign in (#64) |

## Edge cases

- Adding a show that is already there is not an error and changes nothing: neither its place nor its data, and
  TVmaze is not asked.
- Removing a show that is not there is not an error and changes nothing.
- The list belongs to the user, not to the browser: another device shows the same list once the user signs in
  there. (#63)
- A load of the list that fails right after a sign-in says nothing: the sign-in succeeded, and the list stays
  empty until the next start, which loads it with its own toast and Retry. (#63)
- The favorites survive a restart, a sleep and a deploy of the server: they are kept in Firestore. The local server
  uses the same Firestore as the deployed one, and does not start without the credentials to reach it; the tests
  mock the store and reach no Firestore. (#34, #66)

## Decisions

- The client sends only the show id; the server takes the show from its search cache, or else from TVmaze, so the
  client cannot store data the server did not see. A cached answer older than 5 minutes still serves: it is too old
  to stand for a search, not for a name and a poster. (#27)
- A favorite keeps everything the list of the v0.2 mockup shows, the years and the genres included, not only the
  id, name, image and link the issue named; the rating is not kept. (#27)
- The newest first, by `addedAt`; Undo puts a show back in its old place by sending its `addedAt`. (#27) Since #56
  the bookmark pressed again does it, as Undo is gone.
- The store is a `Map` keyed by the show id, not a plain object: a plain object walks number keys in ascending
  order, not in the order added. (#27)
- `PUT` and `DELETE` on `/api/favorites/:id`: both methods change nothing when repeated, which is what adding twice
  and removing a missing show must do. (#27)
- The search results carry no favorite flag: the client holds the list anyway (the counter, the drawer), and a flag
  in the search answer would go stale on every click. The search stays independent of the favorites. (#27)
- Each browser has its own list, named by a client id it makes and sends in a header; not one list for everyone,
  and no accounts yet. A header, not a cookie: the client and the server live on different hosts, where browsers
  block third-party cookies. (#27) Replaced by a list per user in #63.
- The list belongs to the user of the access token, the one of the other API routes, not to the browser. The old
  lists of the browsers are not moved to users: they are dropped. (#63)
- Until #64 a guest's press on a bookmark is sent and refused with `401`, so it rolls back with the toast of a
  failed change; #64 asks the guest to sign in instead. (#63) Replaced in #64: a guest's press sends nothing.
- The guest check is in the task `toggleFavorite`, which answers `{ isGuest, request }`: code on the UI side does
  not read the app's data to decide whether to call a task. (#64)
- Whether the show is saved is read from the store at the press (the store's `findFavorite`), not from the render,
  for the toast and Undo: a render can be stale between two quick presses. (#64)
- The search survives the trip to sign-in: its stores outlive the search page, so after signing in the user sees
  the same results. A reload on `/sign-in` loses it: accepted, as nothing was lost that a search does not bring
  back. (#64)
- The ui-kit drawer knows no count: its title is markup its caller gives, and the favourites put their number there
  themselves. (#64)
- Code and files say «favorite», the American spelling, as it is shorter to write. (#27)
- The bookmark changes when the server answers, not at once: the store changes by the answer, so the bookmarks,
  the counter and the drawer always show one list, and a failed request has nothing to roll back. A change of the
  in-memory list takes a moment, and by the first press the server is awake: the app has loaded the list on
  start. (#28) Replaced by an optimistic update in #41.
- A failed load of the list says so in a toast with Retry, and the bookmarks still work meanwhile. Until Retry the
  counter and the drawer show only the changes of this session: a change answers only what it changed. (#28, #40)
- A bookmark, not the star the issue named: the star marks the rating (`design/v0.2/`). (#28)
- The favorites are kept in Firestore, not in the server's memory, a file or a local SQLite: the host may restart
  the server and wipe its disk at any time. Firestore because the server runs on Firebase (#29): no other account,
  and no key in the code or the settings, as the Admin SDK finds its credentials inside Cloud Functions. Render's
  free Postgres expires, and MongoDB Atlas would have been a second account and a secret. (#34)
- A document per show, `clients/{clientId}/favorites/{showId}`: adding, removing and checking a show touch one
  document, and the list is one read of the browser's collection. The order is kept by `addedAt`, as before. (#34)
  Since #63 under the user: `users/{userId}/favorites/{showId}`, next to the account (`auth.md`).
- The server uses Firestore when Firebase has set `FIREBASE_CONFIG`, and memory otherwise, so local development
  and the tests need no setup. (#34) Replaced by Firestore everywhere in #66.
- The server uses Firestore everywhere it runs, local development included, and the tests mock the store: one
  implementation of the store, and local development runs the real one. The cost is a one-time setup
  (`gcloud auth application-default login`, `GOOGLE_CLOUD_PROJECT` in `server/.env`), and local development changes
  the real data; there is no second database or emulator for it. (#66)
- A toast stays pressable over the open drawer, so Undo of a removal from the drawer works there; keyboard focus
  stays in the drawer, so Undo is not reached by Tab while it is open. (#28) Undo is gone in #56; a toast still stays
  pressable over the drawer, for the «Sign in» and Retry of other toasts.
- A change answers only what it changed: `PUT` the one `Favorite`, `DELETE` `204 No Content` (the standard answer
  for a success with no body, not a bare `200`). The server does not read the list again after a change, and the
  answer does not grow with the list; the client keeps its list in order itself. (#40)
- The change is optimistic: the store changes on the press, and the bookmarks, the counter and the drawer still show
  one list, as they all read the store. One task, `toggleFavorite`, reads the store and adds or removes; `addFavorite`
  and `removeFavorite` change the store before the request and undo their own change if it fails — not a snapshot
  of the list, which would undo another show's change made meanwhile. An added show is shown from the card's data,
  with the browser's time as `addedAt`. The toast of a change shows at once; a failure adds its own toast. `busy` is
  gone: a press is never ignored. (#41)
- The server's answer to `PUT` is not put into the store: the show is already there from the press, and an answer
  that comes after a removal must not bring the show back. Until the list is loaded again, an added show keeps the
  browser's `addedAt`, a few milliseconds off the server's. (#41)
- Accepted, not handled: two presses on one bookmark within a fraction of a second send their requests side by
  side, and the server may apply them in another order; and if both fail, the list may show what the server does
  not have. Both are rare, and the next load of the list puts it right; a queue of requests per show was tried and
  judged not worth its weight. (#41)
- Undo is dropped: a removed show is put back by pressing its bookmark again, on a card or in the list's row. (#56)
- The removed rows of the open list are kept in a store of their own, `App/_stores/useRemovedFavoritesStore`, not as a
  flag on the favorites: the favorites store, the bookmarks and the counters stay as they were. (#56) Since #67 they
  are a field of the favorites store, `removed`, next to `favorites` and `pending`: the data of the favourites lives in
  one store, and only the drawer's open state has a store of its own.
- The removed rows are dropped when the list opens, not when it closes: on close they would vanish during the
  drawer's slide-out. (#56)
- A removal inside the list has no toast on success: the row itself says so. A failure still has one. (#56)
- The `DELETE` goes at the press, as everywhere else, not when the list closes: the counters and the server agree at
  once, and nothing is lost if the tab is closed with the list open. (#56)
- The client always sends `addedAt` with a `PUT`, the old one or the browser's time, rather than choosing whether to
  send a body. (#56)
- Accepted: a show removed from a card and added again before the list opens goes back to its old place, not to the
  top, as its removed favourite is still remembered. (#56)
- The show a guest bookmarked waits in memory, as `pending` of the favorites store, not in the address or
  `sessionStorage`: the trip to the sign-in and sign-up pages stays inside the app, and a reload loses it as it loses
  the search (#64). Only the last pressed show is kept. (#67)
- No toast says the show was added after a sign-in: it is simply in the list. (#67)
- The show is added after the user's list loads, not at the sign-in: the load would replace the list and drop it,
  and only the loaded list tells whether it is saved already. A load that fails right after the sign-in drops the
  show too: rare, and the guest presses the bookmark again. (#67)
- The search forgets the show when it opens: a guest who comes back without signing in adds nothing later. A guest
  who presses a bookmark and then signs in from the header, not from the toast, still gets the show added: they
  asked for it and signed in. The sign-in takes the show before it keeps the session, as the search it then opens
  forgets it. (#67)
