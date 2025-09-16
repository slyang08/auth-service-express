// eslint.config.js
import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier/flat";
import pluginImport from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // eslintRecommended,
  js.configs.recommended,
  {
    files: ["**/*.{js,ts}"], // Specify the file scope where the configuration takes effect

    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        browser: "readonly",
        console: "readonly",
      },
    },

    // Add the import plugin
    plugins: {
      import: pluginImport,
      prettier: prettierPlugin,
    },

    rules: {
      ...prettierConfig.rules,
      "import/order": [
        "error",
        {
          groups: [["builtin", "external"], "internal", ["sibling", "parent"], "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }, // Sort alphabetically
        },
      ],
      "no-console": "off", // Allow use of console
      "prettier/prettier": ["error", { endOfLine: "auto" }], // Enable Prettier rules as errors
      "no-unused-vars": "off",
    },
  },
];
