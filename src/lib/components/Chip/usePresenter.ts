import type { ReactNode } from "react";

export type ChipProps = {
  children: ReactNode;
  onClick: () => void;
  // The number after the label, in a lighter weight.
  count?: number;
  selected?: boolean;
  disabled?: boolean;
};

export const usePresenter = ({ selected = false, count, ...rest }: ChipProps) => {
  return {
    ...rest,
    count,
    hasCount: count !== undefined,
    // A toggle button: screen readers hear «pressed», and the filled style (`_pressed`) follows it.
    ariaPressed: selected,
  };
};
