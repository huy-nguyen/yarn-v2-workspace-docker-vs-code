// This ESLint config follows the instructions here:
// https://github.com/typescript-eslint/typescript-eslint/blob/e5db36f140b6463965858ad4ed77f71a9a00c5a7/docs/getting-started/linting/README.md
// and here
// https://prettier.io/docs/en/integrating-with-linters.html#disable-formatting-rules
// in order to integrate with TypeScript and Prettier
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "../../eslint-configs/eslint-recommended.js", // workaround for `eslint:recommended`,
    "plugin:react/recommended",
    "../../eslint-configs/typescript-eslint-eslint-recommended.js", // workaround for `plugin:@typescript-eslint/eslint-recommended`,
    "../../eslint-configs/typescript-eslint-recommended.js", // workaround for "plugin:@typescript-eslint/recommended",
    "../../eslint-configs/prettier.js", // workaround for `prettier`
    "../../eslint-configs/prettier-typescript-eslint.js", // workaround for 'prettier/@typescript-eslint',
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
