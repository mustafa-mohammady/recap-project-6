import { fetcher } from "./fetcher";
import type { ArtPiece } from "./types";

const artPieces: ArtPiece[] = [
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

test("returns the art pieces of the response", async () => {
  const fetchSpy = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(Response.json(artPieces));

  await expect(fetcher("https://example.com/api/art")).resolves.toEqual(
    artPieces
  );
  expect(fetchSpy).toHaveBeenCalledWith("https://example.com/api/art");
});

test("throws an error when the response is not ok", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, { status: 500 })
  );

  await expect(fetcher("https://example.com/api/art")).rejects.toThrow(
    "Failed to fetch art pieces: 500"
  );
});
