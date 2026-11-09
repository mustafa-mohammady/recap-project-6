import { getRandomArtPiece } from "./getRandomArtPiece";
import type { ArtPiece } from "./types";

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
  {
    slug: "the-night-watch",
    artist: "Rembrandt",
    name: "The Night Watch",
    imageSource: "https://example.com/night-watch.jpg",
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

test.each([
  { random: 0, expected: artPieces[0] },
  { random: 0.5, expected: artPieces[1] },
  { random: 0.999, expected: artPieces[2] },
])(
  "returns the art piece for Math.random() = $random",
  ({ random, expected }) => {
    vi.spyOn(Math, "random").mockReturnValue(random);

    expect(getRandomArtPiece(artPieces)).toBe(expected);
  }
);

test("always returns one of the given art pieces", () => {
  for (let i = 0; i < 50; i++) {
    expect(artPieces).toContain(getRandomArtPiece(artPieces));
  }
});

test("returns undefined when there are no art pieces", () => {
  expect(getRandomArtPiece([])).toBeUndefined();
});
