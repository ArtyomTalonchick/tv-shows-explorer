import { defineSlotRecipe } from "@chakra-ui/react";

// .search-input of design/library: a pill with an icon, the field, and the clear button or the spinner.
export const searchInputRecipe = defineSlotRecipe({
  className: "search-input",
  slots: ["root", "input", "spinner", "clear"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      gap: "3",
      w: "full",
      maxW: "search",
      bg: "bg.glass",
      borderWidth: "1px",
      borderColor: "border",
      rounded: "full",
      color: "fg.subtle",
      backdropFilter: "blur({blurs.glass})",
      transition: "border-color {durations.fast} {easings.standard}",
      _hover: { borderColor: "fg.subtle" },
      _focusWithin: { borderColor: "accent.solid", color: "fg.muted" },
    },
    input: {
      flex: "1",
      minW: "0",
      bg: "transparent",
      border: "0",
      py: "1",
      // As tall as the clear button: the field keeps its height with the button, the spinner or neither.
      minH: "8",
      color: "fg",
      fontWeight: "medium",
      lineHeight: "tight",
      outline: "none",
      _placeholder: { color: "fg.subtle" },
      "&::-webkit-search-cancel-button": { display: "none" },
    },
    spinner: {
      display: "flex",
      mx: "2",
    },
    clear: {
      display: "grid",
      placeItems: "center",
      boxSize: "8",
      flex: "none",
      rounded: "full",
      bg: "bg.muted",
      color: "fg.muted",
      cursor: "pointer",
      _hover: { bg: "border", color: "fg" },
      "& svg": { boxSize: "4" },
    },
  },
  variants: {
    size: {
      md: {
        root: { py: "3", ps: "6", pe: "3" },
        input: { fontSize: "lg" },
      },
      sm: {
        root: { py: "2", ps: "4", pe: "2" },
        input: { fontSize: "md" },
      },
    },
  },
  defaultVariants: { size: "md" },
});
