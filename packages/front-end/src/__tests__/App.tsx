import React from "react";
import { render } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom/extend-expect";
import "../../createTextRangeMock";

test('renders "Prettify" link', () => {
  const { getByText } = render(<App />);
  expect(getByText(/prettify/i)).toBeInTheDocument();
});

test('renders "Merge" link', () => {
  const { getByText } = render(<App />);
  expect(getByText(/merge/i)).toBeInTheDocument();
});
