import type { ArtPieceComment, ArtPieceInfo } from "./types";

// the most characters a comment can have, when written or edited
export const MAX_COMMENT_LENGTH = 150;

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

// a comment has no id, so its date identifies it within its art piece;
// editedDate tells that and when the text was changed
export function editComment(
  artPiecesInfo: ArtPieceInfo[],
  slug: string,
  date: string,
  text: string,
  editedDate: string
): ArtPieceInfo[] {
  return artPiecesInfo.map((info) =>
    info.slug === slug
      ? {
          ...info,
          comments: info.comments.map((comment) =>
            comment.date === date ? { ...comment, text, editedDate } : comment
          ),
        }
      : info
  );
}

// the date identifies the comment within its art piece
export function deleteComment(
  artPiecesInfo: ArtPieceInfo[],
  slug: string,
  date: string
): ArtPieceInfo[] {
  return artPiecesInfo.map((info) =>
    info.slug === slug
      ? {
          ...info,
          comments: info.comments.filter((comment) => comment.date !== date),
        }
      : info
  );
}
