import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { importX } from "eslint-plugin-import-x";
import promise from "eslint-plugin-promise";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["**/dist", "design", ".history"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        plugins: { promise, "import-x": importX },
        languageOptions: { ecmaVersion: 2022 },
        rules: {
            // Imports in three groups, with no empty line between them: packages (the workspace's
            // `@tv-shows-explorer/shared` too), then own code through `~/`, then relative paths. A reader sees at
            // once what comes from outside the app and what stays inside the unit.
            "import-x/order": [
                "error",
                {
                    groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
                    pathGroups: [
                        { pattern: "@tv-shows-explorer/**", group: "external" },
                        { pattern: "~/**", group: "internal" },
                    ],
                    pathGroupsExcludedImportTypes: ["builtin"],
                    "newlines-between": "never",
                },
            ],
            // async / await with try / catch instead of .then chains.
            "promise/prefer-await-to-then": "error",
            "no-restricted-syntax": [
                "error",
                // A component always has a body: when a Presenter call is added, the diff touches only that line.
                {
                    selector: "VariableDeclarator[id.name=/^[A-Z]/] > ArrowFunctionExpression[expression=true]",
                    message: "Write a component with a body: `=> { return (...); }`.",
                },
                // A component is typed by its variable, so its props and its result are read in one place.
                {
                    selector: "VariableDeclarator[id.name=/^[A-Z]/]:not([id.typeAnnotation]) > ArrowFunctionExpression",
                    message: "Type a component as `const Name: FC<NameProps> = (props) => { ... }`.",
                },
                {
                    selector: "FunctionDeclaration[id.name=/^[A-Z]/]",
                    message: "Write a component as `const Name: FC<NameProps> = (props) => { ... }`.",
                },
                // A collection is walked by its own methods (`forEach`, `map`, `filter`, `reduce`), not by a loop.
                {
                    selector: "ForOfStatement, ForInStatement",
                    message:
                        "Walk a collection with its methods (`forEach`, `map`, ...), not with `for...of` / `for...in`.",
                },
            ],
            // A function says what it returns. Callbacks typed by their place (`onClick={() => ...}`, `.map(...)`)
            // are left alone, and so is a one-line function that only calls another one: `() => void call()`.
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowConciseArrowFunctionExpressionsStartingWithVoid: true,
                },
            ],
        },
    },
    {
        // The client runs in the browser, with React.
        files: ["client/**/*.{ts,tsx}"],
        extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
        languageOptions: { globals: globals.browser },
    },
    {
        // The server and its configs run in Node.
        files: ["server/**/*.ts", "client/vite.config.ts"],
        languageOptions: { globals: globals.node },
    },
    {
        // Tests: short helpers around `renderHook` and fixtures, where a return type adds only noise.
        files: ["**/__tests__/**"],
        rules: { "@typescript-eslint/explicit-function-return-type": "off" },
    },
    // Formatting is Prettier's: turn off the ESLint rules that would fight it. Keep this last.
    prettier,
    {
        // After Prettier's config, which turns `curly` off: every if / else has a block, and Prettier puts its body
        // on its own line.
        rules: { curly: ["error", "all"] },
    },
]);
