import { useState } from "react";

import { getRandomArtPiece } from "../getRandomArtPiece";
import type { ArtPiece } from "../types";

type SpotlightProps = {
  artPieces: ArtPiece[];
};

export default function Spotlight({ artPieces }: SpotlightProps) {
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
    </article>
  );
}
