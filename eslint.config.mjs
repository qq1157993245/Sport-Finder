import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      // Code Style
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'max-len': ['error', { 'code': 100 }],

      // Best Practices
      'no-unused-vars': ['error'],
      'no-unused-expressions': ['error'],
      'no-eval': ['error'],
      'no-implicit-globals': ['error'],
      'consistent-return': ['error'],

      // Variables & Functions
      'no-var': ['error'],
      'prefer-const': ['error'],
      'prefer-arrow-callback': ['error'],

      // Misc
      'no-debugger': ['error'],
      'no-empty': ['error'],

      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];