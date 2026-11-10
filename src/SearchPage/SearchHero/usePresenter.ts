import { useMemo } from "react";

const POSTER = "https://static.tvmaze.com/uploads/images/medium_portrait";
const POSTER_PATHS = [
  "501/1253519",
  "504/1262352",
  "548/1371406",
  "211/528026",
  "490/1226764",
  "563/1409008",
  "629/1574642",
  "543/1358056",
];
// The wall behind the hero repeats the posters to fill the screen.
const WALL_COPIES = 4;

export type SearchHeroProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

type UsePresenterResult = SearchHeroProps & {
  // The posters behind the hero.
  wall: { key: string; src: string }[];
};

export const usePresenter = ({ query, onQueryChange }: SearchHeroProps): UsePresenterResult => {
  const wall = useMemo(
    () =>
      POSTER_PATHS.flatMap((path, i) =>
        Array.from({ length: WALL_COPIES }, (_, copy) => ({ key: `${copy}-${i}`, src: `${POSTER}/${path}.jpg` })),
      ),
    [],
  );

  return { query, onQueryChange, wall };
};
