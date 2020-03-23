/* eslint-env node */
let presets = ["@babel/preset-typescript", "@babel/preset-react"];
if (process.env.NODE_ENV === "test") {
  // `@babel/preset-env` is used to transpile ES modules to Common JS for
  // consumption by Jest during tests:
  presets = [
    ...presets,
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ];
}
module.exports = {
  presets,
};
