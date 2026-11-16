import type { Show, ShowsPage, ShowsQuery } from "@tv-shows-explorer/shared";
import { collectGenres } from "./collectGenres";
import { filterByGenre } from "./filterByGenre";

const PER_PAGE = 3;

// The asked page of the found shows of a genre, with the genres of all of them. A page past the last one gives the
// last; no shows of the genre give an empty page 1.
export const getShowsPage = (found: Show[], { genre, page }: Pick<ShowsQuery, "genre" | "page">): ShowsPage => {
  const filtered = filterByGenre(found, genre);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PER_PAGE;

  return {
    shows: filtered.slice(start, start + PER_PAGE),
    genres: collectGenres(found),
    found: found.length,
    genre,
    total: filtered.length,
    page: current,
    perPage: PER_PAGE,
  };
};
