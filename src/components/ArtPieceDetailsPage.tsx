import { Link, useParams } from "react-router";

import { getComments, isFavorite } from "../artPiecesInfo";
import type { ArtPiece, ArtPieceInfo } from "../types";
import ArtPieceDetails from "./ArtPieceDetails";

type ArtPieceDetailsPageProps = {
  artPieces: ArtPiece[];
  artPiecesInfo: ArtPieceInfo[];
  onToggleFavorite: (slug: string) => void;
  onAddComment: (slug: string, text: string) => void;
};

export default function ArtPieceDetailsPage({
  artPieces,
  artPiecesInfo,
  onToggleFavorite,
  onAddComment,
}: ArtPieceDetailsPageProps) {
  // the slug comes from the dynamic route /art-pieces/:slug
  const { slug } = useParams();
  const artPiece = artPieces.find((piece) => piece.slug === slug);

  if (!artPiece) {
    return (
      <div className="text-center">
        <p className="text-stone-500">Art piece not found</p>
        <Link
          to="/art-pieces"
          className="focus-ring mt-4 inline-block rounded text-stone-700 underline underline-offset-4 hover:text-ink"
        >
          ← Back to the gallery
        </Link>
      </div>
    );
  }

  return (
    <ArtPieceDetails
      image={artPiece.imageSource}
      title={artPiece.name}
      artist={artPiece.artist}
      year={artPiece.year}
      genre={artPiece.genre}
      colors={artPiece.colors}
      isFavorite={isFavorite(artPiecesInfo, artPiece.slug)}
      onToggleFavorite={() => onToggleFavorite(artPiece.slug)}
      comments={getComments(artPiecesInfo, artPiece.slug)}
      onAddComment={(text) => onAddComment(artPiece.slug, text)}
    />
  );
}
