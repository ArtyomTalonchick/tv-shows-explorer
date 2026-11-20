import { useRef, type RefObject } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Show } from "@tv-shows-explorer/shared";
import type { PaginationProps } from "@/lib/components/Pagination/Pagination";
import { getPageCount } from "@/lib/pagination/getPageCount";
import { scrollToTopIfAbove } from "@/lib/screen/scrollToTopIfAbove";
import { useSearchStore } from "@/stores/useSearchStore";
import { changePage } from "./_tasks/changePage";
import { formatShownRange } from "./formatShownRange";
import { showPageNotLoadedToast } from "./showPageNotLoadedToast";

type UsePresenterResult = {
    gridRef: RefObject<HTMLUListElement | null>;
    // One page of the shown answer.
    shows: Show[];
    // Hidden when every show fits on one page.
    pagination: PaginationProps | null;
};

export const usePresenter = (): UsePresenterResult => {
    const gridRef = useRef<HTMLUListElement>(null);
    const { query, page, answer } = useSearchStore(
        useShallow((state) => ({ query: state.query, page: state.page, answer: state.answer })),
    );
    const data = answer?.data ?? null;
    // Another page of the shown query is marked as soon as it is asked; while a new query waits and loads, the shown
    // results keep their own.
    const marked = answer?.query === query ? page : (data?.page ?? 1);
    const total = data?.total ?? 0;
    const perPage = data?.perPage ?? 1;

    // The pages are switched below the cards: when the cards start above the screen, bring them into view.
    const handlePageChange = async (next: number): Promise<void> => {
        scrollToTopIfAbove(gridRef.current);
        try {
            await changePage(next);
        } catch {
            showPageNotLoadedToast(next);
        }
    };

    const pagination: PaginationProps | null =
        getPageCount(total, perPage) > 1
            ? {
                  page: marked,
                  perPage,
                  total,
                  onPageChange: (next) => void handlePageChange(next),
                  formatRange: formatShownRange,
              }
            : null;

    return { gridRef, shows: data?.shows ?? [], pagination };
};
