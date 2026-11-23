// What the client and the server share, a folder per subject: the API types, and the rule of valid credentials — the
// one runtime code here, a deliberate exception from the simple-architecture rules
// (`.claude/rules/architecture-exceptions.md`).
export type { Credentials } from "./credentials/credentials";
export { isValidEmail } from "./credentials/isValidEmail";
export { PASSWORD_MIN_LENGTH, isValidPassword } from "./credentials/isValidPassword";
export { normalizeEmail } from "./credentials/normalizeEmail";
export type { AddFavoriteBody, Favorite } from "./favorites/favorites";
export type { Show } from "./shows/show";
export type { GenreCount, ShowsPage, ShowsQuery } from "./shows/shows";
