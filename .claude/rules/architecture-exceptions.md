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
