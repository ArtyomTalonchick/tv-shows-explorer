import { defineRecipe } from "@chakra-ui/react";

// Overrides Chakra's icon with .icon of design/library: 1.25em, the colour of the text.
export const iconRecipe = defineRecipe({
  variants: {
    size: {
      inherit: { boxSize: "1.25em" },
    },
  },
});
