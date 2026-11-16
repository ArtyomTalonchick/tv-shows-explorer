import { useState } from "react";
import { getPageCount } from "@/lib/helpers/getPageCount";

export type UsePaginationResult<T> = {
  page: number;
  pageCount: number;
  pageItems: T[];
  // A page outside 1…pageCount is moved to the nearest one.
  setPage: (next: number) => void;
};

// The page of a list split into pages of `perPage`. The page is kept together with the list it belongs to:
// a new list (a new search, another filter) opens page 1 without an effect.
export const usePagination = <T>(items: T[], perPage: number): UsePaginationResult<T> => {
  const [selected, setSelected] = useState({ items, page: 1 });

  const pageCount = getPageCount(items.length, perPage);
  const page = selected.items === items ? selected.page : 1;
  const start = (page - 1) * perPage;

  return {
    page,
    pageCount,
    pageItems: items.slice(start, start + perPage),
    setPage: (next: number) => setSelected({ items, page: Math.min(Math.max(next, 1), pageCount) }),
  };
};
