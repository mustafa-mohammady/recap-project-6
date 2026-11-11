import { render, screen } from "@testing-library/react";

import CharacterCount from "./CharacterCount";

test("shows how many of the allowed characters are used", () => {
  render(<CharacterCount id="count" count={42} max={150} />);

  expect(screen.getByText("42/150")).toBeInTheDocument();
});

test("tells screen readers only the limit", () => {
  render(
    <>
      <textarea aria-label="Comment" aria-describedby="count" />
      <CharacterCount id="count" count={150} max={150} />
    </>
  );

  // the number changes with every letter; it would be read again and again
  expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
    "150 characters at most"
  );
  expect(screen.getByText("150/150")).toBeInTheDocument();
});
