import type { Show } from "@tv-shows-explorer/shared";
import { searchCache } from "@/routes/_stores/searchCache";

// The show with this id from any search answer the server keeps, or null. An answer older than 5 minutes still
// counts: it is too old to stand for a search, not for the show's name and poster.
export const findCachedShow = (id: number): Show | null => {
    const found = [...searchCache.values()].flatMap(({ shows }) => shows).find((show) => show.id === id);
    return found ?? null;
};
