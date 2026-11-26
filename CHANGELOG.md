# Changelog

All notable changes to TV Shows Explorer are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

- The email of a sign-up is checked more strictly: a few addresses the old check took, such as `anna@example.c`,
  are refused now. A server answer the app does not expect shows as an error instead of breaking the page.

## 0.3.0 — 2026-11-25

- The app moves to https://tv-shows-explorer.web.app, with its server on the same domain; any address of the app
  opens it directly.
- The sign-in and sign-up pages have their own addresses, `/sign-in` and `/sign-up`; an unknown address leads to
  the search.
- Accounts: sign up and sign in with an email and a password. The header shows the signed-in user, with a menu to
  sign out, or «Sign in» for a guest; a reload keeps the user signed in.
- Favourites belong to the signed-in user: the same list on every device and after signing in again. A guest has
  none, and signing out empties the list. The favourites kept by a browser before are not moved.
- A guest's bookmark and favourites ask to sign in: the bookmark shows a toast with «Sign in», and the favourites
  drawer leads to signing in or up. A guest's favourites button has no counter.
- A show removed inside the favourites list keeps its row, dimmed and marked «Removed», until the list opens again;
  its bookmark puts it back in its old place. The toast of a removed favourite no longer offers Undo: the bookmark
  is pressed again.
- A show a guest bookmarked is added to their favourites once they sign in or sign up from its toast's «Sign in»,
  with no second press.

## 0.2.2 — 2026-11-21

- Internal changes only; nothing changes for the user.

## 0.2.1 — 2026-11-20

- Adding or removing a favourite shows at once — the bookmark, the counter and the list — without waiting for the
  server; if the server fails, the change is undone and a toast says so. A bookmark can be pressed again right away.
- Another genre or page that fails to load keeps the shown results, with their genre and page, and says so in a
  toast, instead of the error screen.

## 0.2.0 — 2026-11-18

- The site works through its own server, hosted on Firebase; it no longer calls TVmaze directly.
- Favourites: a bookmark on every show card adds the show to your favourites or removes it, and a toast says so —
  with Undo after a removal. The Favourites button on both screens shows how many there are and opens their list.
  The list is kept on the server for this browser, in a database, so it survives a restart of the server.
- While the next results load — a new query, another genre or another page — the shown ones dim and cannot be
  pressed; the chosen genre or page is marked at once. The search field no longer shows a spinner.
- A search repeated within 5 minutes — with any genre or page — is answered from the server's cache, without
  asking TVmaze again.
- In the app installed on an iPhone, the first tap on the search field opens the keyboard; it no longer takes a
  second tap on the results screen.

## 0.1.1 — 2026-11-10

- Editing the query no longer resets the genre and the page: the shown results stay on screen until the
  next query answers, with a spinner in the field meanwhile.
- Emptying the field and typing the same query back quickly no longer leaves the results loading for good.
- Focusing the search field on the start screen opens the results screen at once; clearing the field keeps you
  there with the field focused, and the logo takes you back to the start screen.

## 0.1.0 — 2026-11-09

- Search TV shows by name: results appear as you type, with loading, no-results and error states and Retry.
- Results are show cards with the poster, rating, years and genres, three per page with pagination; a card
  opens the show on TVmaze.
- Filter the results by genre: chips with the genres of the found shows and their counts; «All» or a second click
  on the chip shows all the results again.
- The app has its own icon and can be installed on a phone or a desktop.

## 0.0.0 — 2026-11-09
