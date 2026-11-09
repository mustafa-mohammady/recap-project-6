import { isFavorite, toggleFavorite } from "./artPiecesInfo";
import type { ArtPieceInfo } from "./types";

const artPiecesInfo: ArtPieceInfo[] = [
  { slug: "the-harvesters", isFavorite: true },
  { slug: "the-night-watch", isFavorite: false },
];

describe("isFavorite", () => {
  test("is true for a favorite art piece", () => {
    expect(isFavorite(artPiecesInfo, "the-harvesters")).toBe(true);
  });

  test("is false for an art piece that is not a favorite anymore", () => {
    expect(isFavorite(artPiecesInfo, "the-night-watch")).toBe(false);
  });

  test("is false for an art piece without any information", () => {
    expect(isFavorite(artPiecesInfo, "unknown")).toBe(false);
  });
});

describe("toggleFavorite", () => {
  test("adds an art piece without information as a favorite", () => {
    expect(toggleFavorite(artPiecesInfo, "unknown")).toEqual([
      ...artPiecesInfo,
      { slug: "unknown", isFavorite: true },
    ]);
  });

  test("removes a favorite art piece from the favorites", () => {
    expect(toggleFavorite(artPiecesInfo, "the-harvesters")).toContainEqual({
      slug: "the-harvesters",
      isFavorite: false,
    });
  });

  test("marks an art piece that is not a favorite as a favorite", () => {
    expect(toggleFavorite(artPiecesInfo, "the-night-watch")).toContainEqual({
      slug: "the-night-watch",
      isFavorite: true,
    });
  });

  test("does not change the given list", () => {
    const before = structuredClone(artPiecesInfo);

    toggleFavorite(artPiecesInfo, "the-harvesters");

    expect(artPiecesInfo).toEqual(before);
  });
});
