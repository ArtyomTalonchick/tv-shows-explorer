import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import tokens from "../../design/tokens.json";

// The theme is built from the design tokens as is: see design/README.md.
const config = defineConfig({
  theme: {
    tokens: tokens.tokens,
    semanticTokens: tokens.semanticTokens,
  },
  globalCss: {
    body: {
      bg: "bg",
      color: "fg",
      fontFamily: "body",
    },
  },
});

export const system = createSystem(defaultConfig, config);
