import { useMemo, useState } from "react";
import type { Show } from "@/SearchPage/types";
import { collectGenres } from "./collectGenres";
import { filterByGenre } from "./filterByGenre";
import type { GenreCount } from "./types";

export type UseGenreFilterResult = {
  genre: string | null;
  genres: GenreCount[];
  filteredShows: Show[];
  select: (next: string | null) => void;
};

// The genre filter of a list of shows. The genre is kept together with the list it was chosen in, so a new list
// (a new search) shows all its shows without an effect. The filtered list keeps its identity between renders,
// so the pagination below it opens page 1 only when the filter or the list changes.
export const useGenreFilter = (shows: Show[]): UseGenreFilterResult => {
  const [selected, setSelected] = useState<{ shows: Show[]; genre: string | null }>({ shows, genre: null });

  const genre = selected.shows === shows ? selected.genre : null;
  const genres = useMemo(() => collectGenres(shows), [shows]);
  const filteredShows = useMemo(() => filterByGenre(shows, genre), [shows, genre]);

  // A click on the selected genre resets the filter, as «All» does.
  const select = (next: string | null): void => {
    setSelected({ shows, genre: next === genre ? null : next });
  };

  return { genre, genres, filteredShows, select };
};
