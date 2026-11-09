import { useState } from "react";

import { isFavorite } from "../artPiecesInfo";
import { getRandomArtPiece } from "../getRandomArtPiece";
import type { ArtPiece, ArtPieceInfo } from "../types";
import FavoriteButton from "./FavoriteButton";

type SpotlightProps = {
  artPieces: ArtPiece[];
  artPiecesInfo: ArtPieceInfo[];
  onToggleFavorite: (slug: string) => void;
};

export default function Spotlight({
  artPieces,
  artPiecesInfo,
  onToggleFavorite,
}: SpotlightProps) {
  // the function passed to useState runs only on the first render,
  // so the spotlight does not change when the component re-renders
  const [spotlightPiece] = useState(() => getRandomArtPiece(artPieces));

  if (!spotlightPiece) {
    return <p>There are no art pieces to show.</p>;
  }

  return (
    <article className="art-piece spotlight">
      <img
        src={spotlightPiece.imageSource}
        alt={`${spotlightPiece.name} by ${spotlightPiece.artist}`}
      />
      <p>{spotlightPiece.artist}</p>
      <FavoriteButton
        isFavorite={isFavorite(artPiecesInfo, spotlightPiece.slug)}
        onToggleFavorite={() => onToggleFavorite(spotlightPiece.slug)}
      />
    </article>
  );
}
