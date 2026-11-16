import type { Show } from "./show";

// A genre of the found shows and the number of them that have it.
export type GenreCount = {
  genre: string;
  count: number;
};

// What `GET /api/shows` is asked: `?q=<query>&genre=<genre>&page=<page>`. The query is trimmed and not empty; no
// genre means all the shows; pages count from 1.
export type ShowsQuery = {
  query: string;
  genre: string | null;
  page: number;
};

// The answer of `GET /api/shows`: one page of the found shows of a genre, and what the filter and the pages need.
export type ShowsPage = {
  shows: Show[];
  // The genres of all the found shows, the most common first, a tie in alphabetical order.
  genres: GenreCount[];
  // The number of all the found shows.
  found: number;
  // The genre the shows were filtered by.
  genre: string | null;
  // The number of the found shows of that genre, over all the pages.
  total: number;
  // The page given; a page past the last one gives the last.
  page: number;
  perPage: number;
};
