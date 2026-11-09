import { Link, useParams } from "react-router";

import type { ArtPiece } from "../types";
import ArtPieceDetails from "./ArtPieceDetails";

type ArtPieceDetailsPageProps = {
  artPieces: ArtPiece[];
};

export default function ArtPieceDetailsPage({
  artPieces,
}: ArtPieceDetailsPageProps) {
  // the slug comes from the dynamic route /art-pieces/:slug
  const { slug } = useParams();
  const artPiece = artPieces.find((piece) => piece.slug === slug);

  if (!artPiece) {
    return (
      <>
        <p>Art piece not found</p>
        <Link to="/art-pieces" className="back-link">
          ← Back to the gallery
        </Link>
      </>
    );
  }

  return (
    <ArtPieceDetails
      image={artPiece.imageSource}
      title={artPiece.name}
      artist={artPiece.artist}
      year={artPiece.year}
      genre={artPiece.genre}
    />
  );
}
