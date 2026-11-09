import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

  render(
    <Spotlight
      artPieces={artPieces}
      artPiecesInfo={[]}
      onToggleFavorite={vi.fn()}
    />
  );

  expect(
    screen.getByRole("img", {
      name: "The Harvesters by Pieter Bruegel the Elder",
    })
  ).toHaveAttribute("src", "https://example.com/harvesters.jpg");
  expect(screen.getByText("Pieter Bruegel the Elder")).toBeInTheDocument();
});

test("keeps the same art piece when it re-renders", () => {
  const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

  const { rerender } = render(
    <Spotlight
      artPieces={artPieces}
      artPiecesInfo={[]}
      onToggleFavorite={vi.fn()}
    />
  );
  randomSpy.mockReturnValue(0.5);
  rerender(
    <Spotlight
      artPieces={[...artPieces]}
      artPiecesInfo={[]}
      onToggleFavorite={vi.fn()}
    />
  );

  expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
  expect(
    screen.queryByText("Pieter Bruegel the Elder")
  ).not.toBeInTheDocument();
});

test("shows a message when there are no art pieces", () => {
  render(
    <Spotlight artPieces={[]} artPiecesInfo={[]} onToggleFavorite={vi.fn()} />
  );

  expect(
    screen.getByText("There are no art pieces to show.")
  ).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

test("shows a favorite button for the spotlight art piece", async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  const handleToggleFavorite = vi.fn();
  render(
    <Spotlight
      artPieces={artPieces}
      artPiecesInfo={[{ slug: "the-harvesters", isFavorite: true }]}
      onToggleFavorite={handleToggleFavorite}
    />
  );

  const button = screen.getByRole("button", { name: "Favorite" });
  expect(button).toHaveAttribute("aria-pressed", "true");

  await user.click(button);

  expect(handleToggleFavorite).toHaveBeenCalledWith("the-harvesters");
});
