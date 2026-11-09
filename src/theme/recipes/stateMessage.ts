import { defineSlotRecipe } from "@chakra-ui/react";

// .state and .state--error of design/library: EmptyState and ErrorState.
export const stateMessageRecipe = defineSlotRecipe({
  className: "state-message",
  slots: ["root", "indicator", "title", "text", "action"],
  base: {
    root: {
      display: "grid",
      justifyItems: "center",
      alignContent: "center",
      gap: "3",
      textAlign: "center",
      py: "16",
      px: "6",
      borderWidth: "1px",
      borderStyle: "dashed",
      borderColor: "border",
      rounded: "lg",
    },
    indicator: {
      display: "grid",
      placeItems: "center",
      boxSize: "16",
      mb: "2",
      rounded: "full",
      bg: "bg.subtle",
      color: "fg.muted",
      "& svg": { boxSize: "8", strokeWidth: "1.75" },
    },
    title: {
      fontSize: "xl",
      fontWeight: "bold",
    },
    text: {
      color: "fg.muted",
      maxW: "prose",
    },
    action: {
      mt: "3",
    },
  },
  variants: {
    tone: {
      neutral: {},
      error: {
        root: { borderStyle: "solid" },
        indicator: { color: "accent.fg" },
      },
    },
  },
  defaultVariants: { tone: "neutral" },
});
