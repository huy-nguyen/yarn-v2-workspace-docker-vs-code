/* eslint-env jest, browser */

// This file mocks the `document.createTextRange` method, which is called in a
// test but not implemented by JSDOM

// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// https://stackoverflow.com/a/46424247/7075699
// https://developer.mozilla.org/en-US/docs/Web/API/Range
Object.defineProperty(document.body, "createTextRange", {
  writable: true,
  value: jest.fn().mockReturnValue({
    getBoundingClientRect: () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      right: 100,
      bottom: 100,
      left: 100,
    }),
    getClientRects: () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      right: 100,
      bottom: 100,
      left: 100,
    }),
  }),
});
