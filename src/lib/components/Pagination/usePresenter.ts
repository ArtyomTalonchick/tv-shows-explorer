import { getPageCount } from "@/lib/helpers/getPageCount";

export type PaginationProps = {
  // The current page, from 1.
  page: number;
  perPage: number;
  // The number of items on all pages.
  total: number;
  onPageChange: (page: number) => void;
};

// Every page gets a button: lists here are short (TVmaze search returns at most 10 shows), so the «…» gap of
// design/library is not needed yet.
export const usePresenter = ({ page, perPage, total, onPageChange }: PaginationProps) => {
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
    // «Shows 4–6 of 8»; a page of one item names just it: «Shows 10 of 10».
    info: first === last ? `Shows ${first} of ${total}` : `Shows ${first}–${last} of ${total}`,
    goTo: onPageChange,
    goBack: () => onPageChange(page - 1),
    goNext: () => onPageChange(page + 1),
  };
};
