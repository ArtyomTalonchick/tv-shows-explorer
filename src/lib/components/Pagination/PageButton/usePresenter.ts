import type { ReactNode } from "react";

export type PageButtonProps = {
  children: ReactNode;
  onClick: () => void;
  isCurrent?: boolean;
  disabled?: boolean;
  label?: string;
};

type UsePresenterResult = Omit<PageButtonProps, "isCurrent"> & {
  // Marks the current page for screen readers and for the filled style (`_currentPage`).
  ariaCurrent: "page" | undefined;
};

export const usePresenter = ({ isCurrent, ...rest }: PageButtonProps): UsePresenterResult => {
  return {
    ...rest,
    ariaCurrent: isCurrent ? "page" : undefined,
  };
};
