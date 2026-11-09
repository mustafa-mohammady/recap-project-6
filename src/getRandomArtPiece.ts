import type { ArtPiece } from "./types";

// returns undefined for an empty list, because there is nothing to pick
export function getRandomArtPiece(
  artPieces: ArtPiece[]
): ArtPiece | undefined {
  // Math.random() is at least 0 and below 1, so the index is 0 to length - 1
  const randomIndex = Math.floor(Math.random() * artPieces.length);
  return artPieces[randomIndex];
}
