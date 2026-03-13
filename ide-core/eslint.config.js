import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'ide-core must not import React' },
            { name: 'react-dom', message: 'ide-core must not import React DOM' },
            { name: 'vue', message: 'ide-core must not import Vue' },
            { name: 'svelte', message: 'ide-core must not import Svelte' },
            { name: 'jsdom', message: 'ide-core must not import jsdom' },
          ],
          patterns: [
            { group: ['*react*', '*vue*', '*svelte*'], message: 'ide-core must not import UI frameworks' },
            { group: ['*@types/react*'], message: 'ide-core must not import React types' },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'ide-core must not use window (DOM)' },
        { name: 'document', message: 'ide-core must not use document (DOM)' },
      ],
    },
  },
];
