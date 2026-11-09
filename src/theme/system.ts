import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import tokens from "../../design/tokens.json";
import { buttonRecipe } from "./recipes/button";
import { iconRecipe } from "./recipes/icon";
import { searchInputRecipe } from "./recipes/searchInput";
import { skeletonRecipe } from "./recipes/skeleton";
import { spinnerRecipe } from "./recipes/spinner";
import { stateMessageRecipe } from "./recipes/stateMessage";
import { textStyles } from "./textStyles";
import { viewTransitionCss, viewTransitionKeyframes } from "./viewTransitions";

// The theme is built from the design tokens as is: see design/README.md.
// The components of design/library are recipes and text styles here; after a change, run `npm run typegen`.
const config = defineConfig({
  theme: {
    tokens: tokens.tokens,
    semanticTokens: tokens.semanticTokens,
    textStyles,
    keyframes: viewTransitionKeyframes,
    recipes: {
      button: buttonRecipe,
      icon: iconRecipe,
      skeleton: skeletonRecipe,
      spinner: spinnerRecipe,
    },
    slotRecipes: {
      searchInput: searchInputRecipe,
      stateMessage: stateMessageRecipe,
    },
  },
  globalCss: {
    body: {
      bg: "bg",
      color: "fg",
      fontFamily: "body",
    },
    ...viewTransitionCss,
  },
});

export const system = createSystem(defaultConfig, config);
