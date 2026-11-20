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
