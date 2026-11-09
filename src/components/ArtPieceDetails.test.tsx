import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import ArtPieceDetails from "./ArtPieceDetails";

function renderDetails() {
  render(
    <MemoryRouter>
      <ArtPieceDetails
        image="https://example.com/harvesters.jpg"
        title="The Harvesters"
        artist="Pieter Bruegel the Elder"
        year="1565"
        genre="Genre Painting"
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />
    </MemoryRouter>
  );
}

test("shows the image, title, artist, year and genre", () => {
  renderDetails();

  expect(
    screen.getByRole("img", {
      name: "The Harvesters by Pieter Bruegel the Elder",
    })
  ).toHaveAttribute("src", "https://example.com/harvesters.jpg");
  expect(
    screen.getByRole("heading", { name: "The Harvesters" })
  ).toBeInTheDocument();
  expect(screen.getByText("Pieter Bruegel the Elder")).toBeInTheDocument();
  expect(screen.getByText("1565")).toBeInTheDocument();
  expect(screen.getByText("Genre Painting")).toBeInTheDocument();
});

test("shows a back link to the list of art pieces", () => {
  renderDetails();

  expect(
    screen.getByRole("link", { name: "← Back to the gallery" })
  ).toHaveAttribute("href", "/art-pieces");
});
