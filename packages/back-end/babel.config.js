/* eslint-env node */

let presets = ["@babel/preset-typescript"];

if (process.env.NODE_ENV === "production") {
  presets = [
    ...presets,
    [
      "@babel/preset-env",
      {
        targets: {
          // Assuming that this codebase is developed using the same NodeJS
          // version as that used in production (a good idea), We want this to match
          // the tag of the NodeJS base image in the `Dockerfile`.
          node: "12.16.1",
        },
      },
    ],
  ];
}

module.exports = {
  presets,
};
