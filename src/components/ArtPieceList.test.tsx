import { render, screen, within } from "@testing-library/react";

import type { ArtPiece } from "../types";
import ArtPieceList from "./ArtPieceList";

const artPieces: ArtPiece[] = [
  {
    slug: "wheat-field-with-cypresses",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "https://example.com/wheat-field.jpg",
  },
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
  },
];

test("shows every art piece as an item of the list", () => {
  render(<ArtPieceList artPieces={artPieces} />);

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
  render(<ArtPieceList artPieces={[]} />);

  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});
