import type { Show } from "@/SearchPage/types";

// The line under a card's name: «2017–2020 · Drama, Science-Fiction». The years are «2019» when a show began and
// ended in one year, «2022–» while it still runs; a part with no data is left out.
export const formatShowMeta = ({ premiered, ended, genres }: Pick<Show, "premiered" | "ended" | "genres">): string => {
  const from = premiered?.slice(0, 4) ?? null;
  const to = ended?.slice(0, 4) ?? "";

  const years = ((): string | null => {
    if (!from) {
      return null;
    }
    if (to === from) {
      return from;
    }
    return `${from}–${to}`;
  })();

  return [years, genres.join(", ")].filter(Boolean).join(" · ");
};
