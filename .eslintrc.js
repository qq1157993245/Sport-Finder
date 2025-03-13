module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "arrow-parens": ["error", "always"],
    "max-len": ["error", { "code": 100 }],
    "no-unused-vars": ["error"],
    "no-console": ["warn"],
    "no-unused-expressions": ["error"],
    "no-eval": ["error"],
    "no-implicit-globals": ["error"],
    "consistent-return": ["error"],
    "no-var": ["error"],
    "prefer-const": ["error"],
    "prefer-arrow-callback": ["error"],
    "no-magic-numbers": ["warn"],
    "no-debugger": ["error"],
    "no-empty": ["error"],
    "react/no-unescaped-entities": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
};
