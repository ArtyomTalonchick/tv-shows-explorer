// What the client and the server share, a folder per subject and a file per schema: the Zod schemas of the API and
// the types they give, and the rule of valid credentials. A file exports only its API, so it is re-exported whole.
export * from "./credentials/credentials";
export * from "./credentials/signInBody";
export * from "./favorites/addFavoriteBody";
export * from "./favorites/favorite";
export * from "./health/health";
export * from "./primitives/wholeNumberText";
export * from "./session/refreshBody";
export * from "./session/sessionResponse";
export * from "./session/sessionTokens";
export * from "./session/user";
export * from "./shows/genreCount";
export * from "./shows/show";
export * from "./shows/showsPage";
export * from "./shows/showsQuery";
