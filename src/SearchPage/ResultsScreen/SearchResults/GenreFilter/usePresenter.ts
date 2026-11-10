import type { ChipProps } from "@/lib/components/Chip/Chip";
import type { GenreCount } from "../types";

export type GenreFilterProps = {
  genres: GenreCount[];
  // The number of all shows, on the «All» chip.
  total: number;
  selected: string | null;
  onSelect: (genre: string | null) => void;
};

type ChipItem = { key: string; props: ChipProps };

type UsePresenterResult = {
  chips: ChipItem[];
};

export const usePresenter = ({ genres, total, selected, onSelect }: GenreFilterProps): UsePresenterResult => {
  const all: ChipItem = {
    key: "",
    props: { children: "All", count: total, selected: selected === null, onClick: () => onSelect(null) },
  };

  const chips = genres.map(({ genre, count }): ChipItem => ({
    key: genre,
    props: { children: genre, count, selected: genre === selected, onClick: () => onSelect(genre) },
  }));

  return { chips: [all, ...chips] };
};
