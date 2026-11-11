import type { ArtPiece } from "./types";

export type ArtPieceFilters = {
  // matched against the title and the artist
  query: string;
  // the art pieces of any of these genres; none shows every genre
  genres: string[];
};

// every genre once, sorted A to Z, for the genre filter
export function getGenres(artPieces: ArtPiece[]): string[] {
  const genres = new Set(artPieces.map((artPiece) => artPiece.genre));
  return [...genres].sort((a, b) => a.localeCompare(b));
}

// returns a new list and never changes the given one
export function filterArtPieces(
  artPieces: ArtPiece[],
  { query, genres }: ArtPieceFilters
): ArtPiece[] {
  // "  STARRY " finds "The Starry Night"
  const search = query.trim().toLowerCase();

  return artPieces.filter((artPiece) => {
    const matchesGenre = genres.length === 0 || genres.includes(artPiece.genre);
    const matchesSearch =
      artPiece.name.toLowerCase().includes(search) ||
      artPiece.artist.toLowerCase().includes(search);

    return matchesGenre && matchesSearch;
  });
}
