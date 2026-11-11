import { useState } from "react";

import { isFavorite } from "../artPiecesInfo";
import { getRandomArtPiece } from "../getRandomArtPiece";
import { getTextOverlay } from "../textOverlay";
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
      <p className="glass px-6 py-20 text-center font-display text-2xl font-semibold tracking-tight text-muted">
        There are no art pieces to show.
      </p>
    );
  }

  // the text color and a light layer in one of the image's own colors,
  // chosen from its palette, so the text fits the image and stays readable
  const { textColor, overlayColor, overlayOpacity } = getTextOverlay(
    spotlightPiece.colors
  );
  // a soft glow in the opposite color, for spots lighter or darker than
  // the palette
  const textShadow =
    textColor === "#ffffff"
      ? "0 1px 12px rgb(0 0 0 / 0.5)"
      : "0 1px 12px rgb(255 255 255 / 0.7)";
  const textStyle = { color: textColor, textShadow };

  return (
    // one container that is all image; the layers share one grid cell, so
    // they lie on top of each other, and the container grows with the text,
    // so a long title is never cut off
    <article className="glass grid overflow-hidden">
      {/* until the image is loaded, the frame shows the overlay color, so
          the text is readable from the start */}
      <div
        className="relative [grid-area:1/1] min-h-[min(30rem,70vh)] md:min-h-[min(40rem,75vh)]"
        style={{ backgroundColor: overlayColor }}
      >
        <img
          src={spotlightPiece.imageSource}
          alt={`${spotlightPiece.name} by ${spotlightPiece.artist}`}
          className="absolute inset-0 size-full animate-[spotlight-in_1s_ease-out] object-cover motion-reduce:animate-none"
        />
      </div>
      {/* one solid color over the whole image, no gradient */}
      <div
        aria-hidden="true"
        className="relative [grid-area:1/1]"
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
      />
      <div className="relative self-end p-6 [grid-area:1/1] md:p-10">
        <h2
          className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl"
          style={textStyle}
        >
          {spotlightPiece.name}
        </h2>
        <p className="mt-3 text-lg font-medium md:text-xl" style={textStyle}>
          {spotlightPiece.artist}
        </p>
      </div>
      <div className="relative m-4 self-start justify-self-end [grid-area:1/1] md:m-6">
        <FavoriteButton
          isFavorite={isFavorite(artPiecesInfo, spotlightPiece.slug)}
          onToggleFavorite={() => onToggleFavorite(spotlightPiece.slug)}
        />
      </div>
    </article>
  );
}
