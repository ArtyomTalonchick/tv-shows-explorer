import { defineRecipe } from "@chakra-ui/react";

// Overrides Chakra's skeleton with .skeleton of design/library and its shapes.
export const skeletonRecipe = defineRecipe({
  base: {
    _motionReduce: { animation: "none" },
  },
  variants: {
    variant: {
      pulse: {
        background: "bg.muted",
        animationDuration: "pulse",
        animationTimingFunction: "standard",
      },
    },
    shape: {
      none: {},
      poster: { aspectRatio: "2 / 3", rounded: "md" },
      line: { h: "4", mt: "4", w: "70%", rounded: "sm" },
      lineShort: { h: "3", mt: "2", w: "45%", rounded: "sm" },
      // As tall as Chip: its vertical padding, one line of its text and its border.
      chip: {
        h: "calc({spacing.4} + {fontSizes.sm} * {lineHeights.tight} + 2px)",
        w: "24",
        flexShrink: "0",
        rounded: "full",
      },
    },
  },
  defaultVariants: { shape: "none" },
});
