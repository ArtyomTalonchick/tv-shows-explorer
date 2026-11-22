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
