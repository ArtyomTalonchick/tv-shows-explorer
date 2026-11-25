import type { Show } from "@tv-shows-explorer/shared";

// The show a guest bookmarked, from the history state of the toast's «Sign in» link, or `null` when the state holds
// none: a page opened another way, or a state of another shape, as history keeps anything it is given.
export const toPendingFavorite = (state: unknown): Omit<Show, "rating"> | null => {
    if (typeof state !== "object" || state === null) {
        return null;
    }
    const { id, name, genres, premiered, ended, image, url } = state as Record<string, unknown>;
    const hasNames = typeof id === "number" && typeof name === "string" && typeof url === "string";
    const hasGenres = Array.isArray(genres) && genres.every((genre): genre is string => typeof genre === "string");
    // The dates and the poster are a text, or `null` when the show has none.
    const hasDates =
        (premiered === null || typeof premiered === "string") &&
        (ended === null || typeof ended === "string") &&
        (image === null || typeof image === "string");
    if (!hasNames || !hasGenres || !hasDates) {
        return null;
    }
    return { id, name, genres, premiered, ended, image, url };
};
