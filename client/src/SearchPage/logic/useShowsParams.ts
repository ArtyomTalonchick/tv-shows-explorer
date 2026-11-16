import { useMemo, useState } from "react";
import type { ShowsQuery } from "@tv-shows-explorer/shared";

export type UseShowsParamsResult = {
  // What to ask the server; `null` for an empty query. The same object while none of its values changes.
  params: ShowsQuery | null;
  selectGenre: (genre: string | null) => void;
  changePage: (page: number) => void;
};

// What the results ask the server for: the query once typing has stopped, and the genre and the page chosen for it.
// A new query starts from all its shows on page 1.
export const useShowsParams = (query: string): UseShowsParamsResult => {
  const [chosen, setChosen] = useState<ShowsQuery>({ query, genre: null, page: 1 });

  // Dropped as soon as the query changes, so typing the old query back does not bring its genre back. The render
  // that sees the change is discarded and run again with the new state; until then the old choice is not used.
  if (chosen.query !== query) {
    setChosen({ query, genre: null, page: 1 });
  }
  const { genre, page } = chosen.query === query ? chosen : { genre: null, page: 1 };

  const params = useMemo((): ShowsQuery | null => (query === "" ? null : { query, genre, page }), [query, genre, page]);

  // A click on the selected genre resets the filter, as «All» does; another genre opens its page 1.
  const selectGenre = (next: string | null): void => {
    setChosen({ query, genre: next === genre ? null : next, page: 1 });
  };

  const changePage = (next: number): void => {
    setChosen({ query, genre, page: next });
  };

  return { params, selectGenre, changePage };
};
