import { getPageCount } from "~/lib/pagination/getPageCount";

// The items the current page holds, from 1: `first`–`last` of `total`; a page of one item has `first === last`.
export type PageRange = {
    first: number;
    last: number;
    total: number;
};

export type PaginationProps = {
    // The current page, from 1.
    page: number;
    perPage: number;
    // The number of items on all pages.
    total: number;
    onPageChange: (page: number) => void;
    // The line under the buttons: the user names its items, so the words are its own.
    formatRange: (range: PageRange) => string;
};

type UsePresenterResult = {
    pages: { number: number; isCurrent: boolean }[];
    isFirst: boolean;
    isLast: boolean;
    // The range of the current page, in the words of `formatRange`.
    info: string;
    goTo: (page: number) => void;
    goBack: () => void;
    goNext: () => void;
};

// Every page gets a button, so the «…» gap of design/library is not built yet.
export const usePresenter = ({
    page,
    perPage,
    total,
    onPageChange,
    formatRange,
}: PaginationProps): UsePresenterResult => {
    const pageCount = getPageCount(total, perPage);
    const first = (page - 1) * perPage + 1;
    const last = Math.min(page * perPage, total);

    return {
        pages: Array.from({ length: pageCount }, (_, index) => ({
            number: index + 1,
            isCurrent: index + 1 === page,
        })),
        isFirst: page === 1,
        isLast: page === pageCount,
        info: formatRange({ first, last, total }),
        goTo: onPageChange,
        goBack: () => onPageChange(page - 1),
        goNext: () => onPageChange(page + 1),
    };
};
