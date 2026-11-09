import { render, screen } from "@testing-library/react";

import type { ArtPiece } from "../types";
import Spotlight from "./Spotlight";

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

afterEach(() => {
  vi.restoreAllMocks();
});

test("shows the image and the artist of a random art piece", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.5);

  render(<Spotlight artPieces={artPieces} />);

  expect(
    screen.getByRole("img", {
      name: "The Harvesters by Pieter Bruegel the Elder",
    })
  ).toHaveAttribute("src", "https://example.com/harvesters.jpg");
  expect(screen.getByText("Pieter Bruegel the Elder")).toBeInTheDocument();
});

test("keeps the same art piece when it re-renders", () => {
  const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

  const { rerender } = render(<Spotlight artPieces={artPieces} />);
  randomSpy.mockReturnValue(0.5);
  rerender(<Spotlight artPieces={[...artPieces]} />);

  expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
  expect(
    screen.queryByText("Pieter Bruegel the Elder")
  ).not.toBeInTheDocument();
});

test("shows a message when there are no art pieces", () => {
  render(<Spotlight artPieces={[]} />);

  expect(
    screen.getByText("There are no art pieces to show.")
  ).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});
