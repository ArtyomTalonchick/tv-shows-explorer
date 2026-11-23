// What the client and the server share: the API types, and the rule of valid credentials — the one runtime code here,
// a deliberate exception from the simple-architecture rules (`.claude/rules/architecture-exceptions.md`).
export type { AddFavoriteBody, Favorite } from "./favorites";
export type { Credentials } from "./credentials/credentials";
export type { HealthResponse } from "./health";
export { isValidEmail } from "./credentials/isValidEmail";
export { PASSWORD_MIN_LENGTH, isValidPassword } from "./credentials/isValidPassword";
export { normalizeEmail } from "./credentials/normalizeEmail";
export type { Show } from "./show";
export type { GenreCount, ShowsPage, ShowsQuery } from "./shows";
