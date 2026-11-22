# gh-tasks rules

Project additions to the gh-tasks skills. Each heading is read at a fixed moment; an empty or missing
heading is skipped. Content may be in any language.

Terms used below:
- **design task** — an issue with the `design` label; it is the first task of every milestone.
- **implementation task** — any other `type:feature` or `type:bug` issue of the milestone.
- The `simple-architecture` skill and the `architecture-reviewer` agent come from the simple-architecture
  plugin. Until the plugin is connected, every rule that names them is skipped.

## Pick
<!-- next-task, before taking a task: what to skip, locks, size limits -->
While the design task of the open milestone is open, take no implementation task of that milestone: take the
design task, or a task that is neither (`type:ops`, `type:wish`).

## Plan
<!-- next-task, after reading the issue: where to look, notes to read -->
Always show the plan and wait for «ok», even when there are no questions (the plan gate is on for every task,
except under `auto`).

The plan of an implementation task lists its commits in order: for each, the subject and what can be checked on the
site after it, or «refactor».

## Implement
<!-- next-task, before coding: project rules, schema or migration conventions -->
- A design task changes only files under `design/`.
- An implementation task first reads the mockup in `design/vX.Y/` (X.Y = the milestone version) and the
  `requirements/` files the issue names, then follows the `simple-architecture` skill.
- Tests live in a `__tests__/` folder next to the code they test
  (`client/src/App/SearchPage/_logic/__tests__/useSearchQuery.test.ts`), never beside the source files. Code of the
  folder that holds `__tests__/` is imported relatively (`../useSearchQuery`); anything else through the `~/`
  alias.
- `requirements/` is the source of truth. When the issue, the mockup or the code contradicts it, stop and ask
  the user; record the decision under `## Decisions` in that requirements file.

## Verify
<!-- next-task, after checks and before showing: manual checks, reviewers, local URLs -->
For an implementation task, before each commit is shown for approval, and again after a change to it — on that
commit's files only, so a small step stays quick:
- `npx eslint <files>` and `npx prettier --check <files>` in the project root.
- `npx vitest related --run <files>` in the workspace of the files: the tests that reach them.
- `npm run typecheck -w <workspace>` for each workspace the commit changes: a type check cannot be narrowed to files.
- Run the `architecture-reviewer` agent on the commit's diff; fix what it finds or show why not.
- A commit that changes a screen: run the app, take a screenshot of that screen and compare it with the mockup in
  `design/vX.Y/`; show the differences.
- Say what to open and check on the site after this commit.

After the last commit of the task, once: run every command of `checks` on the whole project. A failure found there
is fixed in the commit it belongs to; the history is local until the release.

## Commit
<!-- commit, before committing: anything beyond config.commit -->
An implementation task is split into small commits, so each is easy to review and to check: one commit is one logical
step. A step either moves the site forward by something that can be checked on it, or is a refactor of code already
in use. A commit adds no code that nothing uses yet. Every commit passes its checks (see `## Verify`) on its own. A
design, `type:ops` or docs task is not split by this rule. (#28)

These go into the task's commit — its last one, when it has several — not a separate one:
- The feature file in `requirements/` that the task changes or creates is updated to match the change.
- A change the user can see gets a line under `## Unreleased` in `CHANGELOG.md`.

## After commit
<!-- next-task, after each commit: syncs, merges -->

## Close
<!-- next-task, after closing: notes to update, knowledge to capture -->
- Feedback on the simple-architecture plugin found during the task goes to an issue in the plugin's project
  (ArtyomTalonchick/claude-simple-architecture), labelled `status:inbox`: a new issue, or a comment on an open
  feedback issue. Feedback is: a gap in the rules, two rules in conflict, a case the reviewer decided differently
  on different runs, and a reviewer warning or note that does not fit the case (left unfixed because the rule
  does not suit it). The task report always says what was filed, or «no plugin feedback».
- A code preference the owner stated during the task goes to `.claude/rules/code-style.md`, with the issue number.

## Triage
<!-- triage, while rewriting a body: markers to keep, comment conventions, extra line semantics -->
A `type:feature` issue names, under **Where**, the `requirements/` file it changes or creates.

## Plan version
<!-- plan-version, while choosing scope: release size, themes, groups -->
- The first issue of every milestone is its design task (label `design`); every other issue of the milestone
  follows it.
- Each `type:feature` issue in the milestone names the `requirements/` file it changes or creates.

## Release
<!-- release, before the gate: checks, version bump, changelog, steps after the commit -->
Set the version from the milestone: `npm version X.Y.Z --no-git-tag-version`; its files go into the release commit.

In `CHANGELOG.md`, put `## X.Y.Z — YYYY-MM-DD` (the release date) right under `## Unreleased`, so the lines
collected there become this release's section and `## Unreleased` is empty again. The file goes into the
release commit.

Before the release commit, read `README.md` against the code and bring it up to date; it goes into the release
commit too. Check each part:
- **Features** — every feature of `requirements/` and of this release's `CHANGELOG.md` section is there, and none
  that is gone.
- **AI Rules** — the plugin version is the one the project is built by now: the installed version of the
  simple-architecture plugin, not the project's own version. The link points to that tag.
- **Live**, **Stack**, **Repository layout**, **Scripts** — the addresses, the hosting, the packages, the folders
  and the commands are the real ones.

## Release notes
<!-- release, while writing the GitHub Release notes: format, sections, links -->

## Ship
<!-- release, after the tag and the draft: push, deploy trigger -->

## After release
<!-- release, once the release is out: deploy checks, notes to prune, announcements -->
