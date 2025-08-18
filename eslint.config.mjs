import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierPlugin from 'eslint-plugin-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    ignores: ['dist', 'node_modules', '*.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
//      'jsx-a11y': jsxA11y,
      perfectionist,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': ['error'],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      "react/button-has-type": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-comment-textnodes": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "error",
      "react/no-children-prop": "error",
      "react/no-deprecated": "error",
      "react/no-find-dom-node": "error",
      "react/no-string-refs": "error",
      "react/self-closing-comp": "error",
      "react/void-dom-elements-no-children": "error",

      'import/first': 'error',
      'import/newline-after-import': 'error',

      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          groups: [
            'builtin',
            'external',
            'internal-type',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'style',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-exports': ['error', { type: 'natural' }],
      'perfectionist/sort-objects': ['error', { type: 'natural' }],
      'perfectionist/sort-interfaces': ['error', { type: 'natural' }],
      'perfectionist/sort-union-types': ['error', { type: 'natural' }],
      'perfectionist/sort-enums': ['error', { type: 'natural' }],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'line-length',
          ignoreCase: true,
          fallbackSort: { type: 'natural' },
          groups: ['multiline-prop', 'unknown', 'shorthand-prop', 'callback'],
          customGroups: [
            {
              groupName: 'callback',
              elementNamePattern: '^on.+',
            },
          ],
        },
      ],

      // TypeScript - re-enable the good stuff
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: "all",
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: "none",
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',

      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-generic-constructors": "error",
      "@typescript-eslint/method-signature-style": ["error", "property"],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/no-redeclare": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-loop-func": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'no-duplicate-imports': 'error',

      // Basic accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/control-has-associated-label": "off",
      "jsx-a11y/mouse-events-have-key-events": "off",
      "jsx-a11y/label-has-for": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
  {
    files: ['vite.config.ts'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.node.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.node,

    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
