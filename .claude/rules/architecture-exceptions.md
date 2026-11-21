# Exceptions from simple-architecture

Places where the project deliberately departs from the rules of the simple-architecture plugin, because the owner
thinks the rule is wrong for the case. Each one waits for a change in the plugin, filed as an issue there.

- The `architecture-reviewer` gets this file with the change it reviews: a finding that matches an exception is not
  fixed, and the report names the exception.
- When the plugin's rule changes and the project updates to that plugin version, the exception is removed from
  this file, with the code-style line that points here.

## A View reads its own style table by a ready key

ArtyomTalonchick/claude-simple-architecture#61 · since #47

A table of styles per variant lives in the component file, above the View, and the View reads its row by a key the
Presenter returns: `{...VARIANT_STYLES[variant]}`. The plugin reads `TABLE[key]` in a View as «a value picked by a
condition» (core `view-presenter.md`); here it is a style lookup, like a theme token. The default of the key and a
key chosen by a condition stay in the Presenter. Code-style: the variant styles rule (#12, #47).

## A plain function of the UI side calls a task

ArtyomTalonchick/claude-simple-architecture#62 · since #51

A handler that calls a task and decides what follows on the screen — a toast at once, an error toast when the task
rejects, Undo — is a plain function in its own file in the unit's `_logic/` (`FavoriteToggle/_logic/toggle/toggle.ts`,
with its part `undo.ts`), and the Presenter calls it: `handleClick: () => void toggle(show, saved)`. The plugin reads a plain
function that calls a task as a violation (core `stateful-logic-and-functions.md`, `imports.md`) and leaves such a
handler to the Presenter, inline or with the task passed as a callback. Since 0.2.8 it also reads the part `undo.ts`
as a task, being a step of a business action (core `entry-folders.md`): here it is the screen's answer to a toast's
Undo, and the step itself — putting the show back — is the task `addFavorite` it calls. Only the UI side calls such a
function: a task never does, and the steps of the business action stay in the task. Code-style: the handler rule
(#51).
