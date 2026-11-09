import { render, screen } from "@testing-library/react";

import ArtPiecePreview from "./ArtPiecePreview";

test("shows the image, the title and the artist of the art piece", () => {
  render(
    <ArtPiecePreview
      image="https://example.com/wheat-field.jpg"
      title="Wheat Field with Cypresses"
      artist="Vincent van Gogh"
    />
  );

  expect(
    screen.getByRole("img", {
      name: "Wheat Field with Cypresses by Vincent van Gogh",
    })
  ).toHaveAttribute("src", "https://example.com/wheat-field.jpg");
  expect(
    screen.getByRole("heading", { name: "Wheat Field with Cypresses" })
  ).toBeInTheDocument();
  expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
});
