import type { ArtPieceInfo } from "./types";

export function isFavorite(
  artPiecesInfo: ArtPieceInfo[],
  slug: string
): boolean {
  return (
    artPiecesInfo.find((info) => info.slug === slug)?.isFavorite ?? false
  );
}

// returns a new list and never changes the given one, as React state needs
export function toggleFavorite(
  artPiecesInfo: ArtPieceInfo[],
  slug: string
): ArtPieceInfo[] {
  const exists = artPiecesInfo.some((info) => info.slug === slug);

  if (!exists) {
    return [...artPiecesInfo, { slug, isFavorite: true }];
  }

  return artPiecesInfo.map((info) =>
    info.slug === slug ? { ...info, isFavorite: !info.isFavorite } : info
  );
}
