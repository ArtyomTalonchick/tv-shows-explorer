import type { Show } from "@/SearchPage/types";
import type { GenreCount } from "./types";

// The unique genres of the shows with their counts: the most common first, a tie in alphabetical order.
export const collectGenres = (shows: Pick<Show, "genres">[]): GenreCount[] => {
  const counts = new Map<string, number>();
  for (const show of shows) {
    for (const genre of new Set(show.genres)) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre));
};
