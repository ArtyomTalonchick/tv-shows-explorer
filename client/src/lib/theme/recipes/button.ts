import { defineRecipe } from "@chakra-ui/react";

// Overrides Chakra's button with .btn of design/library: `solid` (the accent), `ghost` and `glass`, sizes `md`
// (.btn) and `sm` (.btn--sm).
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
        // .btn.is-loading: a request is on its way; the button keeps its colour, not the look of a disabled one.
        _loading: { opacity: "1", filter: "none", cursor: "progress" },
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
            // .btn--glass: over the hero and in the search bar, where the page shows through it.
            glass: {
                borderWidth: "1px",
                borderColor: "border",
                bg: "bg.glass",
                color: "fg",
                fontWeight: "semibold",
                backdropFilter: "blur({blurs.glass})",
                transitionProperty: "background, border-color",
                _hover: { borderColor: "fg.subtle", bg: "bg.muted" },
                _active: { bg: "bg.subtle" },
            },
        },
        size: {
            md: {
                h: "auto",
                minW: "auto",
                px: "6",
                py: "3",
                gap: "2",
                textStyle: "none",
                fontSize: "md",
                lineHeight: "tight",
                _icon: { boxSize: "1.25em" },
            },
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
    // .btn--glass is .btn--sm with a taller line: the size sets the line height after the variant, so it is set here.
    compoundVariants: [{ variant: "glass", size: "sm", css: { lineHeight: "{spacing.6}" } }],
    defaultVariants: { size: "sm" },
});
