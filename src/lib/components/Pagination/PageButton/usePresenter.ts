import type { ReactNode } from "react";

export type PageButtonProps = {
  children: ReactNode;
  onClick: () => void;
  isCurrent?: boolean;
  disabled?: boolean;
  label?: string;
};

export const usePresenter = ({ isCurrent, ...rest }: PageButtonProps) => {
  return {
    ...rest,
    // Marks the current page for screen readers and for the filled style (`_currentPage`).
    ariaCurrent: isCurrent ? ("page" as const) : undefined,
  };
};
