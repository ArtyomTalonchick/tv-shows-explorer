import type { Show } from "@/SearchPage/types";

// The shows of one genre; with no genre, the same list as it was given.
export const filterByGenre = <T extends Pick<Show, "genres">>(shows: T[], genre: string | null): T[] => {
  if (genre === null) {
    return shows;
  }
  return shows.filter((show) => show.genres.includes(genre));
};
