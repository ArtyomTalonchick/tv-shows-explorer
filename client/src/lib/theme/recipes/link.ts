import { defineRecipe } from "@chakra-ui/react";

// Adds .link of design/library to Chakra's link as the variant `accent`: a link inside a text, in the accent colour,
// underlined on hover. It stays inline, so a long one wraps with the text around it.
export const linkRecipe = defineRecipe({
    variants: {
        variant: {
            accent: {
                display: "inline",
                color: "accent.fg",
                fontWeight: "semibold",
                textDecoration: "none",
                rounded: "sm",
                _hover: { textDecoration: "underline", textUnderlineOffset: "3px" },
            },
        },
    },
});
