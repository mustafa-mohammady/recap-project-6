import { filterArtPieces, getGenres } from "./filterArtPieces";
import type { ArtPiece } from "./types";

function createArtPiece(
  slug: string,
  name: string,
  artist: string,
  genre: string
): ArtPiece {
  return {
    slug,
    name,
    artist,
    genre,
    imageSource: `https://example.com/${slug}.jpg`,
    year: "1900",
    colors: [],
  };
}

const wheatField = createArtPiece(
  "wheat-field",
  "Wheat Field with Cypresses",
  "Vincent van Gogh",
  "Landscape Painting"
);
const harvesters = createArtPiece(
  "the-harvesters",
  "The Harvesters",
  "Pieter Bruegel the Elder",
  "Genre Painting"
);
const starryNight = createArtPiece(
  "starry-night",
  "The Starry Night",
  "Vincent van Gogh",
  "Landscape Painting"
);

const artPieces = [wheatField, harvesters, starryNight];

describe("getGenres", () => {
  test("returns every genre once, sorted A to Z", () => {
    expect(getGenres(artPieces)).toEqual([
      "Genre Painting",
      "Landscape Painting",
    ]);
  });

  test("returns no genres for no art pieces", () => {
    expect(getGenres([])).toEqual([]);
  });
});

describe("filterArtPieces", () => {
  test("returns all art pieces without a search and a genre", () => {
    expect(filterArtPieces(artPieces, { query: "", genres: [] })).toEqual(
      artPieces
    );
  });

  test("finds art pieces by their title", () => {
    expect(
      filterArtPieces(artPieces, { query: "harvest", genres: [] })
    ).toEqual([harvesters]);
  });

  test("finds art pieces by their artist", () => {
    expect(
      filterArtPieces(artPieces, { query: "van gogh", genres: [] })
    ).toEqual([wheatField, starryNight]);
  });

  test("ignores upper and lower case and spaces around the search", () => {
    expect(
      filterArtPieces(artPieces, { query: "  STARRY  ", genres: [] })
    ).toEqual([starryNight]);
  });

  test("returns all art pieces for a search with only spaces", () => {
    expect(filterArtPieces(artPieces, { query: "   ", genres: [] })).toEqual(
      artPieces
    );
  });

  test("returns only the art pieces of the chosen genre", () => {
    expect(
      filterArtPieces(artPieces, { query: "", genres: ["Genre Painting"] })
    ).toEqual([harvesters]);
  });

  test("returns the art pieces of any of the chosen genres", () => {
    expect(
      filterArtPieces(artPieces, {
        query: "",
        genres: ["Genre Painting", "Landscape Painting"],
      })
    ).toEqual(artPieces);
  });

  test("combines the search and the genre", () => {
    expect(
      filterArtPieces(artPieces, {
        query: "the",
        genres: ["Landscape Painting"],
      })
    ).toEqual([starryNight]);
  });

  test("returns no art pieces when nothing matches", () => {
    expect(
      filterArtPieces(artPieces, { query: "mona lisa", genres: [] })
    ).toEqual([]);
  });

  test("does not change the given list", () => {
    const copy = [...artPieces];

    filterArtPieces(artPieces, {
      query: "harvest",
      genres: ["Genre Painting"],
    });

    expect(artPieces).toEqual(copy);
  });
});
