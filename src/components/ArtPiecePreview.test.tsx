import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import ArtPiecePreview from "./ArtPiecePreview";

function renderPreview() {
  render(
    <MemoryRouter>
      <ArtPiecePreview
        slug="wheat-field-with-cypresses"
        image="https://example.com/wheat-field.jpg"
        title="Wheat Field with Cypresses"
        artist="Vincent van Gogh"
      />
    </MemoryRouter>
  );
}

test("shows the image, the title and the artist of the art piece", () => {
  renderPreview();

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

test("links to the details page of the art piece", () => {
  renderPreview();

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/art-pieces/wheat-field-with-cypresses"
  );
});
