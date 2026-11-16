import { useRef, type RefObject } from "react";
import type { PaginationProps } from "@/lib/components/Pagination/Pagination";
import type { ShowCardProps } from "@/lib/components/ShowCard/ShowCard";
import { getPageCount } from "@/lib/helpers/getPageCount";
import { scrollToTopIfAbove } from "@/lib/helpers/scrollToTopIfAbove";
import type { Show } from "@tv-shows-explorer/shared";
import { formatShowMeta } from "./formatShowMeta";

// One page of the shows, and the pages of all of them: `total` shows, `perPage` on each.
export type ResultsListProps = PaginationProps & {
    shows: Show[];
};

type CardItem = { id: number; props: ShowCardProps };

type UsePresenterResult = {
    gridRef: RefObject<HTMLUListElement | null>;
    cards: CardItem[];
    // Hidden when every show fits on one page.
    pagination: PaginationProps | null;
};

export const usePresenter = ({ shows, page, perPage, total, onPageChange }: ResultsListProps): UsePresenterResult => {
    const gridRef = useRef<HTMLUListElement>(null);

    // The pages are switched below the cards: when the cards start above the screen, bring them into view.
    const changePage = (next: number): void => {
        onPageChange(next);
        scrollToTopIfAbove(gridRef.current);
    };

    const cards = shows.map((show): CardItem => ({
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
        getPageCount(total, perPage) > 1 ? { page, perPage, total, onPageChange: changePage } : null;

    return { gridRef, cards, pagination };
};
