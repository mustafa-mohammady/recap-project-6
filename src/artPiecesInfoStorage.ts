import type { ArtPieceInfo } from "./types";

export const ART_PIECES_INFO_KEY = "art-pieces-info";

// keeps only entries that look like an ArtPieceInfo, so broken or old saved
// data cannot crash the app
function isArtPieceInfo(value: unknown): value is ArtPieceInfo {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const info = value as Record<string, unknown>;
  return (
    typeof info.slug === "string" &&
    typeof info.isFavorite === "boolean" &&
    Array.isArray(info.comments)
  );
}

export function loadArtPiecesInfo(): ArtPieceInfo[] {
  try {
    const savedValue = localStorage.getItem(ART_PIECES_INFO_KEY);
    // nothing saved yet, for example on the first visit
    if (savedValue === null) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(savedValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(isArtPieceInfo) : [];
  } catch {
    // invalid JSON, or the browser blocks the local storage
    return [];
  }
}

export function saveArtPiecesInfo(artPiecesInfo: ArtPieceInfo[]): void {
  try {
    localStorage.setItem(ART_PIECES_INFO_KEY, JSON.stringify(artPiecesInfo));
  } catch {
    // the storage is full or blocked: the app keeps working without saving
  }
}
