// What the client and the server share, a file per subject: the Zod schemas of the API and the types they give, and
// the rule of valid credentials — runtime code, a deliberate exception from the simple-architecture rules
// (`.claude/rules/architecture-exceptions.md`). A subject file exports only the API, so it is re-exported whole.
export * from "./credentials/credentials";
export * from "./credentials/isValidEmail";
export * from "./credentials/isValidPassword";
export * from "./credentials/normalizeEmail";
export * from "./favorites/favorites";
export * from "./session/session";
export * from "./shows/show";
export * from "./shows/shows";
