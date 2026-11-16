import type { Show } from "@tv-shows-explorer/shared";
import { searchCache } from "@/stores/searchCache";

// Saves the shows TVmaze found for `query`, replacing an older entry.
export const writeCachedSearch = (query: string, shows: Show[]): void => {
    searchCache.set(query, { shows, savedAt: Date.now() });
};
