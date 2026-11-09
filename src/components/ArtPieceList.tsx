import { isFavorite } from "../artPiecesInfo";
import type { ArtPiece, ArtPieceInfo } from "../types";
import ArtPiecePreview from "./ArtPiecePreview";

type ArtPieceListProps = {
  artPieces: ArtPiece[];
  artPiecesInfo: ArtPieceInfo[];
  onToggleFavorite: (slug: string) => void;
};

export default function ArtPieceList({
  artPieces,
  artPiecesInfo,
  onToggleFavorite,
}: ArtPieceListProps) {
  return (
    <ul className="art-list">
      {artPieces.map((artPiece) => (
        <li key={artPiece.slug}>
          <ArtPiecePreview
            slug={artPiece.slug}
            image={artPiece.imageSource}
            title={artPiece.name}
            artist={artPiece.artist}
            isFavorite={isFavorite(artPiecesInfo, artPiece.slug)}
            onToggleFavorite={() => onToggleFavorite(artPiece.slug)}
          />
        </li>
      ))}
    </ul>
  );
}
