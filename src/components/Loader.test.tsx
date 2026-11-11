import { render, screen } from "@testing-library/react";

import Loader from "./Loader";

// the message is visually hidden, but screen readers read it
test("gives screen readers the given message", () => {
  render(<Loader message="Loading art pieces…" />);

  expect(screen.getByText("Loading art pieces…")).toBeInTheDocument();
});

test("shows only the message to screen readers", () => {
  render(<Loader message="Loading art pieces…" />);

  // the spinning ring is only decoration: no image, no list
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});
