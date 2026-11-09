import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import promise from "eslint-plugin-promise";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "design", ".history"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { promise },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // async / await with try / catch instead of .then chains.
      "promise/prefer-await-to-then": "error",
      // A component always has a body: when a Presenter call is added, the diff touches only that line.
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclarator[id.name=/^[A-Z]/] > ArrowFunctionExpression[expression=true]",
          message: "Write a component with a body: `=> { return (...); }`.",
        },
      ],
    },
  },
  // Formatting is Prettier's: turn off the ESLint rules that would fight it. Keep this last.
  prettier,
  {
    // After Prettier's config, which turns `curly` off: every if / else has a block, and Prettier puts its body
    // on its own line.
    rules: { curly: ["error", "all"] },
  },
]);
