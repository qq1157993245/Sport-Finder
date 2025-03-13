import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
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
      'no-console': ['warn'],
      'no-unused-expressions': ['error'],
      'no-eval': ['error'],
      'no-implicit-globals': ['error'],
      'consistent-return': ['error'],

      // Variables & Functions
      'no-var': ['error'],
      'prefer-const': ['error'],
      'prefer-arrow-callback': ['error'],

      // Misc
      'no-magic-numbers': ['warn'],
      'no-debugger': ['error'],
      'no-empty': ['error'],

      // React-Specific Rules
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];
