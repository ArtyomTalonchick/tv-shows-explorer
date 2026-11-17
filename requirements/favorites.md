# Favorites

## Purpose

The user keeps the shows they want to come back to in one list.

## Behaviour

All the favorites logic is on the server; the client shows the list and sends the user's clicks. (#27)

1. Each browser has its own list. On its first start the client makes a client id (`crypto.randomUUID()`), keeps it,
   and sends it in the `X-Client-Id` header of every `/api/favorites` request. There are no accounts.
2. `GET /api/favorites` answers the browser's list (`Favorite[]`), the newest first.
3. `PUT /api/favorites/:id` adds the show with this TVmaze id and answers the list. The server takes the show from
   the answers of the searches it keeps (`search.md`); a show it has not seen is asked of TVmaze
   (`GET https://api.tvmaze.com/shows/:id`).
4. A favorite keeps what the list shows — id, name, genres, years, poster, the TVmaze link — and the time it was
   added, so the list needs no TVmaze request.
5. `DELETE /api/favorites/:id` removes the show and answers the list.
6. Undo of a removal sends `PUT /api/favorites/:id` with the `addedAt` of the removed favorite
   (`{ "addedAt": 1763300000000 }`): the show comes back to its old place in the list. Without a body the show is
   added now, at the top.
7. The search results (`GET /api/shows`) do not say which shows are favorites: the client checks the ids against the
   list it holds.

## States

| State | What the server answers |
|---|---|
| No favorites | `GET` answers `[]` |
| Favorites | `GET`, `PUT` and `DELETE` answer the browser's whole list, the newest first |
| No `X-Client-Id`, or not a UUID | 400, nothing changes |
| A wrong id (not a whole number from 1) or body | 400, nothing changes |
| TVmaze has no show with the id | 404, nothing changes |
| TVmaze does not answer | 502, nothing changes |

## Edge cases

- Adding a show that is already there is not an error and changes nothing: neither its place nor its data, and
  TVmaze is not asked.
- Removing a show that is not there is not an error and changes nothing.
- The list belongs to the browser, not to a person: another browser or device has its own, and clearing the
  browser's data starts an empty one.
- The favorites are kept in the server's memory, so they are lost when the server restarts or sleeps (the host puts
  it to sleep after 15 minutes without requests). A database is a separate task (#34).

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
