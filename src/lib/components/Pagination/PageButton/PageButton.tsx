import { chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type PageButtonProps = {
  children: ReactNode;
  onClick: () => void;
  isCurrent?: boolean;
  disabled?: boolean;
  label?: string;
};

// .pagination__item of design/library: a round button, filled when it is the current page.
export const PageButton = ({ children, onClick, isCurrent, disabled, label }: PageButtonProps) => {
  return (
    <chakra.button
      type="button"
      aria-label={label}
      aria-current={isCurrent ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      display="grid"
      placeItems="center"
      minW="10"
      h="10"
      px="3"
      borderWidth="1px"
      borderColor="border"
      rounded="full"
      bg="transparent"
      color="fg.muted"
      fontSize="sm"
      fontWeight="semibold"
      cursor="pointer"
      transition="background {durations.fast} {easings.standard}, color {durations.fast} {easings.standard}"
      focusVisibleRing="none"
      _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
      _hover={{ bg: "bg.muted", color: "fg" }}
      _currentPage={{ bg: "fg", borderColor: "fg", color: "bg", _hover: { bg: "fg", color: "bg" } }}
      _disabled={{
        bg: "transparent",
        borderColor: "bg.muted",
        color: "fg.subtle",
        cursor: "not-allowed",
        _hover: { bg: "transparent", color: "fg.subtle" },
      }}
    >
      {children}
    </chakra.button>
  );
};
