import { RESULTS_GRID_ID } from "@/App/SearchPage/ResultsScreen/SearchResults/ResultsList/constants";
import type { PaginationProps } from "@/lib/components/Pagination/Pagination";
import { getPageCount } from "@/lib/pagination/getPageCount";
import { scrollToTopIfAbove } from "@/lib/screen/scrollToTopIfAbove";
import { useSearchStore } from "@/stores/useSearchStore";
import { changePage } from "./_tasks/changePage";
import { formatShownRange } from "./formatShownRange";
import { showPageNotLoadedToast } from "./showPageNotLoadedToast";

type UsePresenterResult = {
    // Hidden when every show fits on one page.
    pagination: PaginationProps | null;
};

export const usePresenter = (): UsePresenterResult => {
    const query = useSearchStore((state) => state.query);
    const page = useSearchStore((state) => state.page);
    const answer = useSearchStore((state) => state.answer);
    const data = answer?.data ?? null;
    const total = data?.total ?? 0;
    const perPage = data?.perPage ?? 1;

    if (getPageCount(total, perPage) <= 1) {
        return { pagination: null };
    }

    // The pages are switched below the cards: when the cards start above the screen, bring them into view.
    const handlePageChange = async (next: number): Promise<void> => {
        scrollToTopIfAbove(document.getElementById(RESULTS_GRID_ID));
        try {
            await changePage(next);
        } catch {
            showPageNotLoadedToast(next);
        }
    };

    return {
        pagination: {
            // Another page of the shown query is marked as soon as it is asked; while a new query waits and
            // loads, the shown results keep their own.
            page: answer?.query === query ? page : (data?.page ?? 1),
            perPage,
            total,
            onPageChange: (next) => void handlePageChange(next),
            formatRange: formatShownRange,
        },
    };
};
