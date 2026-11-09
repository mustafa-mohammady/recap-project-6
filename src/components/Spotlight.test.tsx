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
    colors: ["#37412E", "#8D7332", "#838665", "#718F98", "#9DA59E"],
  },
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
    year: "1565",
    genre: "Genre Painting",
    colors: ["#C49A4A", "#6E7A3A", "#3E4A2A", "#D9C58C", "#8AA3B5"],
  },
];

// fakes the random number, so the test knows which art piece is picked:
// with 2 art pieces, 0 picks the first and 1 picks the second
function mockRandomValue(value: number) {
  return vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
    if (array instanceof Uint32Array) {
      array[0] = value;
    }
    return array;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

test("shows the image and the artist of a random art piece", () => {
  mockRandomValue(1);

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
  mockRandomValue(0);

  const { rerender } = render(
    <Spotlight
      artPieces={artPieces}
      artPiecesInfo={[]}
      onToggleFavorite={vi.fn()}
    />
  );
  mockRandomValue(1);
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
  mockRandomValue(1);
  const handleToggleFavorite = vi.fn();
  render(
    <Spotlight
      artPieces={artPieces}
      artPiecesInfo={[
        { slug: "the-harvesters", isFavorite: true, comments: [] },
      ]}
      onToggleFavorite={handleToggleFavorite}
    />
  );

  const button = screen.getByRole("button", { name: "Favorite" });
  expect(button).toHaveAttribute("aria-pressed", "true");

  await user.click(button);

  expect(handleToggleFavorite).toHaveBeenCalledWith("the-harvesters");
});
