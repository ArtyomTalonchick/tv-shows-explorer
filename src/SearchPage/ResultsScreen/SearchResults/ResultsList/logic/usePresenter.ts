import { useRef, type RefObject } from "react";
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

type CardItem = { id: number; props: ShowCardProps };

type UsePresenterResult = {
  gridRef: RefObject<HTMLUListElement | null>;
  cards: CardItem[];
  // Hidden when every show fits on one page.
  pagination: PaginationProps | null;
};

export const usePresenter = ({ shows }: ResultsListProps): UsePresenterResult => {
  const { page, pageCount, pageItems, setPage } = usePagination(shows, PER_PAGE);
  const gridRef = useRef<HTMLUListElement>(null);

  // The pages are switched below the cards: when the new cards start above the screen, bring them into view.
  const changePage = (next: number): void => {
    setPage(next);
    scrollToTopIfAbove(gridRef.current);
  };

  const cards = pageItems.map((show): CardItem => ({
    id: show.id,
    props: {
      name: show.name,
      href: show.url,
      image: show.image,
      rating: show.rating,
      meta: formatShowMeta(show),
    },
  }));

  const pagination: PaginationProps | null =
    pageCount > 1 ? { page, perPage: PER_PAGE, total: shows.length, onPageChange: changePage } : null;

  return { gridRef, cards, pagination };
};
