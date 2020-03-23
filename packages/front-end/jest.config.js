/* eslint-env node */

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    // This mocks out static CSS `require` calls:
    // https://jestjs.io/docs/en/webpack#handling-static-assets
    "\\.css$": "<rootDir>/__mocks__/styleMock.js",
  },

  // The test environment that will be used for testing
  testEnvironment: "jest-environment-jsdom",
};
