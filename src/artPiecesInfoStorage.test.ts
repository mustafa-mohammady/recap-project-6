import {
  ART_PIECES_INFO_KEY,
  loadArtPiecesInfo,
  saveArtPiecesInfo,
} from "./artPiecesInfoStorage";
import type { ArtPieceInfo } from "./types";

const artPiecesInfo: ArtPieceInfo[] = [
  {
    slug: "the-harvesters",
    isFavorite: true,
    comments: [
      { text: "Wonderful colors", date: "2026-11-09T10:00:00.000Z" },
    ],
  },
];

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("loadArtPiecesInfo", () => {
  test("returns an empty list when nothing is saved", () => {
    expect(loadArtPiecesInfo()).toEqual([]);
  });

  test("returns the saved information", () => {
    localStorage.setItem(ART_PIECES_INFO_KEY, JSON.stringify(artPiecesInfo));

    expect(loadArtPiecesInfo()).toEqual(artPiecesInfo);
  });

  test("returns an empty list for a saved value that is not JSON", () => {
    localStorage.setItem(ART_PIECES_INFO_KEY, "{ not json");

    expect(loadArtPiecesInfo()).toEqual([]);
  });

  test("returns an empty list for a saved value that is not a list", () => {
    localStorage.setItem(ART_PIECES_INFO_KEY, JSON.stringify({ a: 1 }));

    expect(loadArtPiecesInfo()).toEqual([]);
  });

  test("leaves out saved entries that are not art piece information", () => {
    localStorage.setItem(
      ART_PIECES_INFO_KEY,
      JSON.stringify([
        ...artPiecesInfo,
        null,
        "the-night-watch",
        { slug: "missing-comments", isFavorite: true },
      ])
    );

    expect(loadArtPiecesInfo()).toEqual(artPiecesInfo);
  });

  test("returns an empty list when the browser blocks the storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(loadArtPiecesInfo()).toEqual([]);
  });
});

describe("saveArtPiecesInfo", () => {
  test("saves the information as JSON", () => {
    saveArtPiecesInfo(artPiecesInfo);

    expect(localStorage.getItem(ART_PIECES_INFO_KEY)).toBe(
      JSON.stringify(artPiecesInfo)
    );
  });

  test("saved information can be loaded again", () => {
    saveArtPiecesInfo(artPiecesInfo);

    expect(loadArtPiecesInfo()).toEqual(artPiecesInfo);
  });

  test("does not throw when the storage is full or blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() => saveArtPiecesInfo(artPiecesInfo)).not.toThrow();
  });
});
