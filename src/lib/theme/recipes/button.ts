import { defineRecipe } from "@chakra-ui/react";

// Overrides Chakra's button with .btn of design/library: `solid` (the accent) and `ghost`, size `sm`.
export const buttonRecipe = defineRecipe({
  base: {
    rounded: "full",
    borderWidth: "0",
    fontWeight: "bold",
    lineHeight: "tight",
    transitionProperty: "background, color",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
    focusVisibleRing: "none",
    _focusVisible: { outline: "3px solid", outlineColor: "accent.solid", outlineOffset: "3px" },
    _icon: { boxSize: "1.25em" },
  },
  variants: {
    variant: {
      solid: {
        bg: "accent.solid",
        color: "accent.contrast",
        _hover: { bg: "accent.hover" },
        _active: { bg: "accent.active" },
      },
      ghost: {
        bg: "bg.muted",
        color: "fg",
        _hover: { bg: "border" },
        _active: { bg: "bg.subtle" },
      },
    },
    size: {
      sm: {
        h: "auto",
        minW: "auto",
        px: "4",
        py: "2",
        gap: "2",
        textStyle: "none",
        fontSize: "sm",
        lineHeight: "tight",
        _icon: { boxSize: "1.25em" },
      },
    },
  },
  defaultVariants: { size: "sm" },
});
