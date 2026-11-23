# Favorites

## Purpose

The user keeps the shows they want to come back to in one list.

## Behaviour

All the favorites logic is on the server; the client shows the list and sends the user's clicks. (#27)

1. Each browser has its own list. On its first start the client makes a client id (`crypto.randomUUID()`), keeps it,
   and sends it in the `X-Client-Id` header of every `/api/favorites` request. There are no accounts.
2. `GET /api/favorites` answers the browser's list (`Favorite[]`), the newest first.
3. `PUT /api/favorites/:id` adds the show with this TVmaze id and answers that one `Favorite`; a show already there
   is answered as it is. (#40) The server takes the show from
   the answers of the searches it keeps (`search.md`); a show it has not seen is asked of TVmaze
   (`GET https://api.tvmaze.com/shows/:id`).
4. A favorite keeps what the list shows — id, name, genres, years, poster, the TVmaze link — and the time it was
   added, so the list needs no TVmaze request.
5. `DELETE /api/favorites/:id` removes the show and answers `204 No Content`. `GET` is the only request that answers
   the whole list; after a change the client puts the answered favorite in its place by `addedAt`, or removes the
   show by id. (#40)
6. Undo of a removal sends `PUT /api/favorites/:id` with the `addedAt` of the removed favorite
   (`{ "addedAt": 1763300000000 }`): the show comes back to its old place in the list. Without a body the show is
   added now, at the top.
7. The search results (`GET /api/shows`) do not say which shows are favorites: the client checks the ids against the
   list it holds.

What the user sees (`design/v0.2/`): (#28)

8. The client loads the list when the app starts. Both screens show the **Favourites** button with the number of
   favorites, 0 too: in the hero's top-right corner, opposite the logo, and at the end of the search bar (on a phone,
   on the first row with the logo).
9. Every show card has a bookmark — a bookmark, not a star: the star marks the rating. It is filled in the accent
   while the show is a favorite; on a phone it sits at the right end of the row. A press adds or removes the show.
10. The bookmark, the counter and the list change at once, on the press, and the request goes in the background; the
    bookmark can be pressed again at any time. A toast says what was done for 4 s, at once too: «Added **Dark** to
    favourites», or «Removed **Dark** from favourites» with **Undo**, which puts the show back in its old place (6).
    If the server answers an error, the bookmark, the counter and the list go back to how they were, and a toast
    says so: «Couldn’t add **Dark** to favourites» (or remove). (#41)
11. The button opens the list in a drawer from the right, full width on a phone: «Your list · Favourites N», a row
    per show, the newest first, with its poster, name, years and genres; the row leads to the show on TVmaze. The
    bookmark of a row removes the show: the row leaves and the toast offers Undo. The backdrop, × and Escape close
    the drawer; a press on a toast does not.
12. Two quick presses on one bookmark are both kept: a failure of the first one does not undo the second. (#41)

## States

| State | What the server answers |
|---|---|
| No favorites | `GET` answers `[]`; `DELETE` still answers 204 |
| Favorites | `GET` answers the browser's whole list, the newest first; `PUT` the one `Favorite`; `DELETE` 204 (#40) |
| No `X-Client-Id`, or not a UUID | 400, nothing changes |
| A wrong id (not a whole number from 1) or body | 400, nothing changes |
| TVmaze has no show with the id | 404, nothing changes |
| TVmaze does not answer | 502, nothing changes |

| State | What the user sees (#28) |
|---|---|
| No favorites | The counter shows 0 in a grey badge; the drawer says «No favourites yet» and how to add a show |
| Favorites | The counter in the accent; filled bookmarks on their cards; a row per show in the drawer |
| A change on its way | The bookmark, the counter and the list already show it; the bookmark answers every press (#41) |
| Added, removed | A toast with the show's name; a removal offers Undo |
| A change failed | The bookmark, the counter and the list go back; «Couldn’t add **Dark** to favourites» (or remove) in a toast (#41) |
| The list did not load | «Couldn’t load your favourites» in a toast with Retry; the counter shows 0 meanwhile |

## Edge cases

- Adding a show that is already there is not an error and changes nothing: neither its place nor its data, and
  TVmaze is not asked.
- Removing a show that is not there is not an error and changes nothing.
- The list belongs to the browser, not to a person: another browser or device has its own, and clearing the
  browser's data starts an empty one.
- The favorites survive a restart, a sleep and a deploy of the server: they are kept in Firestore. The local server
  uses the same Firestore as the deployed one, and does not start without the credentials to reach it; the tests
  mock the store and reach no Firestore. (#34, #66)

## Decisions

- The client sends only the show id; the server takes the show from its search cache, or else from TVmaze, so the
  client cannot store data the server did not see. A cached answer older than 5 minutes still serves: it is too old
  to stand for a search, not for a name and a poster. (#27)
- A favorite keeps everything the list of the v0.2 mockup shows, the years and the genres included, not only the
  id, name, image and link the issue named; the rating is not kept. (#27)
- The newest first, by `addedAt`; Undo puts a show back in its old place by sending its `addedAt`. (#27)
- The store is a `Map` keyed by the show id, not a plain object: a plain object walks number keys in ascending
  order, not in the order added. (#27)
- `PUT` and `DELETE` on `/api/favorites/:id`: both methods change nothing when repeated, which is what adding twice
  and removing a missing show must do. (#27)
- The search results carry no favorite flag: the client holds the list anyway (the counter, the drawer), and a flag
  in the search answer would go stale on every click. The search stays independent of the favorites. (#27)
- Each browser has its own list, named by a client id it makes and sends in a header; not one list for everyone,
  and no accounts yet. A header, not a cookie: the client and the server live on different hosts, where browsers
  block third-party cookies. (#27)
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
- The server uses Firestore when Firebase has set `FIREBASE_CONFIG`, and memory otherwise, so local development
  and the tests need no setup. (#34) Replaced by Firestore everywhere in #66.
- The server uses Firestore everywhere it runs, local development included, and the tests mock the store: one
  implementation of the store, and local development runs the real one. The cost is a one-time setup
  (`gcloud auth application-default login`, `GOOGLE_CLOUD_PROJECT` in `server/.env`), and local development changes
  the real data; there is no second database or emulator for it. (#66)
- A toast stays pressable over the open drawer, so Undo of a removal from the drawer works there; keyboard focus
  stays in the drawer, so Undo is not reached by Tab while it is open. (#28)
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
