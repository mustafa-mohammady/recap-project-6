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
    return (
      <p className="text-center text-stone-500">
        There are no art pieces to show.
      </p>
    );
  }

  return (
    <article className="mx-auto max-w-2xl">
      <div className="relative">
        <img
          src={spotlightPiece.imageSource}
          alt={`${spotlightPiece.name} by ${spotlightPiece.artist}`}
          className="h-[min(28rem,60vh)] w-full rounded-2xl object-cover shadow-lg"
        />
        <div className="absolute top-4 right-4">
          <FavoriteButton
            isFavorite={isFavorite(artPiecesInfo, spotlightPiece.slug)}
            onToggleFavorite={() => onToggleFavorite(spotlightPiece.slug)}
          />
        </div>
      </div>
      <p className="mt-4 text-center text-xl font-medium">
        {spotlightPiece.artist}
      </p>
    </article>
  );
}
