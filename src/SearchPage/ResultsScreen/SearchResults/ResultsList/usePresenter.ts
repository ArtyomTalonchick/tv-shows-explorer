import { useRef } from "react";
import type { PaginationProps } from "@/lib/components/Pagination/Pagination";
import type { ShowCardProps } from "@/lib/components/ShowCard/ShowCard";
import { scrollToTopIfAbove } from "@/lib/helpers/scrollToTopIfAbove";
import { usePagination } from "@/lib/hooks/usePagination";
import type { Show } from "@/SearchPage/types";
import { formatShowMeta } from "./formatShowMeta";

const PER_PAGE = 3;

export type ResultsListProps = {
  shows: Show[];
};

export const usePresenter = ({ shows }: ResultsListProps) => {
  const { page, pageCount, pageItems, setPage } = usePagination(shows, PER_PAGE);
  const gridRef = useRef<HTMLUListElement>(null);

  // The pages are switched below the cards: when the new cards start above the screen, bring them into view.
  const changePage = (next: number) => {
    setPage(next);
    scrollToTopIfAbove(gridRef.current);
  };

  const cards = pageItems.map((show): { id: number; props: ShowCardProps } => ({
    id: show.id,
    props: {
      name: show.name,
      href: show.url,
      image: show.image,
      rating: show.rating,
      meta: formatShowMeta(show),
    },
  }));

  // Hidden when every show fits on one page.
  const pagination: PaginationProps | null =
    pageCount > 1 ? { page, perPage: PER_PAGE, total: shows.length, onPageChange: changePage } : null;

  return { gridRef, cards, pagination };
};
