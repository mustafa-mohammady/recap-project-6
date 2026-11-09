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
        colors={["#C49A4A", "#6E7A3A"]}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        comments={[
          { text: "Wonderful colors", date: "2026-11-09T10:00:00.000Z" },
        ]}
        onAddComment={vi.fn()}
      />
    </MemoryRouter>
  );
}

test("shows the comments section and the comment form", () => {
  renderDetails();

  expect(
    screen.getByRole("region", { name: "Comments" })
  ).toHaveTextContent("Wonderful colors");
  expect(
    screen.getByRole("textbox", { name: "Add a comment" })
  ).toBeInTheDocument();
});

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

test("shows the color palette of the art piece", () => {
  renderDetails();

  const palette = screen.getByRole("region", { name: "Color palette" });
  expect(palette).toHaveTextContent("#C49A4A");
  expect(palette).toHaveTextContent("#6E7A3A");
});
