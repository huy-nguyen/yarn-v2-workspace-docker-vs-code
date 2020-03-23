// Adapted from
// https://github.com/typescript-eslint/typescript-eslint/blob/4eedd7f5713b4967fe975ab30bd8f6a8323c81d2/packages/eslint-plugin/src/configs/base.json

/* eslint-env node */

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: { sourceType: "module" },
  plugins: ["@typescript-eslint"]
};
