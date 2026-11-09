import { chakra } from "@chakra-ui/react";
import { usePresenter, type ChipProps } from "./usePresenter";

export type { ChipProps } from "./usePresenter";

// .chip of design/library: a round toggle button with a label and a count, filled when it is selected.
export const Chip = (props: ChipProps) => {
  const { children, count, hasCount, ariaPressed, onClick, disabled } = usePresenter(props);

  return (
    <chakra.button
      type="button"
      aria-pressed={ariaPressed}
      disabled={disabled}
      onClick={onClick}
      display="inline-flex"
      alignItems="center"
      gap="2"
      flexShrink="0"
      px="4"
      py="2"
      borderWidth="1px"
      borderColor="border"
      rounded="full"
      bg="transparent"
      color="fg.muted"
      fontSize="sm"
      fontWeight="semibold"
      lineHeight="tight"
      whiteSpace="nowrap"
      cursor="pointer"
      transition="background {durations.fast} {easings.standard}, color {durations.fast} {easings.standard}, border-color {durations.fast} {easings.standard}"
      focusVisibleRing="none"
      _focusVisible={{ outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" }}
      _hover={{ bg: "bg.muted", color: "fg" }}
      _active={{ bg: "bg.subtle" }}
      _pressed={{
        bg: "accent.solid",
        borderColor: "accent.solid",
        color: "accent.contrast",
        _hover: { bg: "accent.hover", borderColor: "accent.hover", color: "accent.contrast" },
      }}
      _disabled={{
        bg: "transparent",
        color: "fg.subtle",
        cursor: "not-allowed",
        _hover: { bg: "transparent", color: "fg.subtle" },
      }}
    >
      {children}
      {hasCount && (
        <chakra.span fontWeight="normal" opacity="0.7">
          {count}
        </chakra.span>
      )}
    </chakra.button>
  );
};
