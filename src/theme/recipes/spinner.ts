import { defineRecipe } from "@chakra-ui/react";

// Overrides Chakra's spinner with .spinner of design/library: an accent arc on a muted track.
export const spinnerRecipe = defineRecipe({
  base: {
    borderWidth: "3px",
    borderColor: "bg.muted",
    borderTopColor: "accent.solid",
    "--spinner-track-color": "colors.bg.muted",
    animationDuration: "spin",
    animationTimingFunction: "linear",
    _motionReduce: { animation: "none" },
  },
  variants: {
    size: {
      md: { "--spinner-size": "sizes.6" },
    },
  },
});
