import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierPlugin from 'eslint-plugin-prettier';
import mantine from 'eslint-config-mantine';

export default [
  {
    ignores: ['dist', 'node_modules', '*.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...mantine.map((config) =>
    config.languageOptions?.parserOptions?.project
      ? {
          ...config,
          languageOptions: {
            ...config.languageOptions,
            parserOptions: { project: './tsconfig.json' },
          },
        }
      : config,
  ),
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      // 'jsx-a11y': jsxA11y,
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
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',

      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'no-duplicate-imports': 'error',

      // Basic accessibility
      // 'jsx-a11y/alt-text': 'error',
      // 'jsx-a11y/anchor-has-content': 'error',
    },
  },
  {
    files: ['vite.config.ts'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.node.json',
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
