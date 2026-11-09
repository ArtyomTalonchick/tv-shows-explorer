import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import tokens from "../../../design/tokens.json";
import { buttonRecipe } from "./recipes/button";
import { iconRecipe } from "./recipes/icon";
import { skeletonRecipe } from "./recipes/skeleton";
import { spinnerRecipe } from "./recipes/spinner";
import { textStyles } from "./textStyles";
import { viewTransitionCss, viewTransitionKeyframes } from "./viewTransitions";

// The theme is built from the design tokens as is: see design/README.md.
// It holds only what is global: tokens, text styles, global CSS and overrides of Chakra's own components; a
// component of design/library keeps its styles in its own JSX. After a change, run `npm run typegen`.
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
