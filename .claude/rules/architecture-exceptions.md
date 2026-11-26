# Exceptions from simple-architecture

Places where the project deliberately departs from the rules of the simple-architecture plugin, because the owner
thinks the rule is wrong for the case. Each one waits for a change in the plugin, filed as an issue there.

- The `architecture-reviewer` gets this file with the change it reviews: a finding that matches an exception is not
  fixed, and the report names the exception.
- When the plugin's rule changes and the project updates to that plugin version, the exception is removed from
  this file, with the code-style line that points here.

## A Presenter hands the View the toaster of the pure zone

ArtyomTalonchick/claude-simple-architecture#70 · since #57

`lib/ui-kit/Toaster/_logic/usePresenter.ts` only returns `{ toaster }`, the toast queue that `createToaster` makes in
`lib/toast/toaster` and `showToast` fills. The plugin's rules do not say whether such library state is a store a View
may not import, so the reviewer may read this Presenter as one with no logic (core and react `view-presenter.md`).
The project keeps the Presenter, so the View imports no state, until the plugin settles the case.

## The local start file of the server calls a check on start

ArtyomTalonchick/claude-simple-architecture#72 · since #66

`server/src/index.ts` awaits the task `server/src/_logic/_tasks/checkGoogleCredentials.ts` and stops with a message
when the Google credentials or `GOOGLE_CLOUD_PROJECT` are missing. The plugin's rules let a start file import no task
and call no task from a start (core `imports.md`, `tasks.md`), so the reviewer reports Levels, Imports, and Stateful
logic and plain functions on it. They give such a check no other place either; the project keeps it in the root
unit's tasks folder until the plugin settles the case.

## The shared package holds the schemas of the API and the rule of valid credentials

ArtyomTalonchick/claude-simple-architecture#81 · since #61, widened by #31

`shared/src/` holds the Zod schemas of the API, a subject per folder, each next to the type it gives
(`z.infer`): the requests and the answers, a part several of them share (`primitives/wholeNumberText.ts`), and the rule of valid credentials, `credentialsSchema` with
`PASSWORD_MIN_LENGTH` in `credentials/credentials.ts`, with `normalizeEmail` in a file of its own. The plugin's rules
keep the shared types package to types only (core `imports.md`), so the reviewer reports Imports on it. The server
checks the requests and the client the answers and its forms by these schemas; two copies, one per app, would drift
apart unseen. The project keeps the schemas in the shared package, with their tests, until the plugin settles the
case.

## A store file exports its own read hook

ArtyomTalonchick/claude-simple-architecture#75 · since #62

`client/src/stores/useSessionStore.ts` exports `useIsSignedIn` next to the store, the store's own reading of
whether a user is signed in; the Presenters of the root unit, of `FavoritesDrawer` and its `FavoritesTitle`, of
`SearchPage/_components/Account` and of `Account/FavoritesOpener/FavoritesCount` call it. The
plugin's rules keep a store file to the store and its own API, with no subscription to show the data (core
`stateful-logic-and-functions.md`), and a Zustand store file to `create(...)` and nothing else (zustand
`stateful-logic-and-functions.md`), a file to one thing (core `one-thing-per-file.md`), and a level to no shared
logic (core `placement.md`), so the reviewer may report Stateful logic and plain functions, One thing per file and
Placement on it. They give the hook no other place either; the project keeps it next to the store until the plugin
settles the case.

## A middleware two route units share lies in the app's tasks folder

ArtyomTalonchick/claude-simple-architecture#77 · since #63

`server/src/tasks/session/requireUser.ts` is the Hono middleware that checks the access token, answers 401 and passes
`userId` on; the `/session` and `/favorites` route units use it, and its env type `UserEnv` lies in
`server/src/tasks/types.ts`. The plugin's rules keep a one-user middleware in its unit's logic folder (core
`levels.md`) and give a shared one no place: a task has nothing from the UI framework and leaves what follows to its
caller (core `tasks.md`), so the reviewer may report Tasks on it. The project keeps it in the tasks folder until the plugin settles
the case.
