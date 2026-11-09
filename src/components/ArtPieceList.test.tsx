import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import type { ArtPiece } from "../types";
import ArtPieceList from "./ArtPieceList";

const artPieces: ArtPiece[] = [
  {
    slug: "wheat-field-with-cypresses",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "https://example.com/wheat-field.jpg",
    year: "1889",
    genre: "Landscape Painting",
  },
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
    year: "1565",
    genre: "Genre Painting",
  },
];

test("shows every art piece as an item of the list", () => {
  render(
    <MemoryRouter>
      <ArtPieceList artPieces={artPieces} />
    </MemoryRouter>
  );

  const items = within(screen.getByRole("list")).getAllByRole("listitem");
  expect(items).toHaveLength(2);
  expect(
    within(items[0]).getByRole("heading", {
      name: "Wheat Field with Cypresses",
    })
  ).toBeInTheDocument();
  expect(
    within(items[1]).getByRole("heading", { name: "The Harvesters" })
  ).toBeInTheDocument();
});

test("shows an empty list when there are no art pieces", () => {
  render(
    <MemoryRouter>
      <ArtPieceList artPieces={[]} />
    </MemoryRouter>
  );

  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});
