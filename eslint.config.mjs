import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // Global ignores
  {
    ignores: ["dist", "node_modules", ".astro", ".env", "bun.lock"],
  },

  // Astro recommended configuration
  ...eslintPluginAstro.configs.recommended,

  // TypeScript configuration for .ts and .tsx files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },

  // Configuration for script tags inside .astro files
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      // Add any specific overrides for Astro files here
    },
  },
];
