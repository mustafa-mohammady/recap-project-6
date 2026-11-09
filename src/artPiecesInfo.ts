import type { ArtPieceComment, ArtPieceInfo } from "./types";

function findInfo(
  artPiecesInfo: ArtPieceInfo[],
  slug: string
): ArtPieceInfo | undefined {
  return artPiecesInfo.find((info) => info.slug === slug);
}

export function isFavorite(
  artPiecesInfo: ArtPieceInfo[],
  slug: string
): boolean {
  return findInfo(artPiecesInfo, slug)?.isFavorite ?? false;
}

export function getComments(
  artPiecesInfo: ArtPieceInfo[],
  slug: string
): ArtPieceComment[] {
  return findInfo(artPiecesInfo, slug)?.comments ?? [];
}

// the functions below return a new list and never change the given one,
// as React state needs

export function toggleFavorite(
  artPiecesInfo: ArtPieceInfo[],
  slug: string
): ArtPieceInfo[] {
  if (!findInfo(artPiecesInfo, slug)) {
    return [...artPiecesInfo, { slug, isFavorite: true, comments: [] }];
  }

  return artPiecesInfo.map((info) =>
    info.slug === slug ? { ...info, isFavorite: !info.isFavorite } : info
  );
}

export function addComment(
  artPiecesInfo: ArtPieceInfo[],
  slug: string,
  comment: ArtPieceComment
): ArtPieceInfo[] {
  if (!findInfo(artPiecesInfo, slug)) {
    return [...artPiecesInfo, { slug, isFavorite: false, comments: [comment] }];
  }

  return artPiecesInfo.map((info) =>
    info.slug === slug
      ? { ...info, comments: [...info.comments, comment] }
      : info
  );
}
