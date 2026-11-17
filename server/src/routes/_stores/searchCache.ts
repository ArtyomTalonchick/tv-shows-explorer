import type { Show } from "@tv-shows-explorer/shared";

// One TVmaze answer kept in memory: the shows found for a query and when they were saved (ms since the epoch).
export type CachedSearch = { shows: Show[]; savedAt: number };

const globalStore = globalThis as typeof globalThis & { searchCache?: Map<string, CachedSearch> };

// The TVmaze answers by query, reached only by the tasks `readCachedSearch`, `writeCachedSearch`,
// `dropExpiredSearches` and `findCachedShow` (a favorite is taken from them). It lives on `globalThis`, so the
// server keeps one cache however its modules are loaded; it is lost when the server restarts or sleeps. A `Map`, not
// a plain object: a query such as «constructor» is not found on its prototype.
globalStore.searchCache ??= new Map<string, CachedSearch>();
export const searchCache = globalStore.searchCache;
