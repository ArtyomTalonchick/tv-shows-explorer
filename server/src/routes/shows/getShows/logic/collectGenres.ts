import type { GenreCount, Show } from "@tv-shows-explorer/shared";

// The unique genres of the shows with their counts: the most common first, a tie in alphabetical order.
export const collectGenres = (shows: Pick<Show, "genres">[]): GenreCount[] => {
  const counts = new Map<string, number>();
  shows.forEach((show) => {
    new Set(show.genres).forEach((genre) => {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    });
  });

  return [...counts]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre));
};
