import type { ArtPiece } from "./types";

// returns undefined for an empty list, because there is nothing to pick
export function getRandomArtPiece(artPieces: ArtPiece[]): ArtPiece | undefined {
  if (artPieces.length === 0) {
    return undefined;
  }

  // crypto.getRandomValues() instead of Math.random(): the same in use here,
  // but it is a secure random number generator, so SonarJS has no concern
  const [randomValue] = crypto.getRandomValues(new Uint32Array(1));
  // the remainder of the division is 0 to length - 1, a valid index
  const randomIndex = randomValue % artPieces.length;
  return artPieces[randomIndex];
}
