import { Link } from "react-router";

import type { ArtPieceComment } from "../types";
import ColorPalette from "./ColorPalette";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import FavoriteButton from "./FavoriteButton";

type ArtPieceDetailsProps = {
  image: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  colors: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  comments: ArtPieceComment[];
  onAddComment: (text: string) => void;
};

export default function ArtPieceDetails({
  image,
  title,
  artist,
  year,
  genre,
  colors,
  isFavorite,
  onToggleFavorite,
  comments,
  onAddComment,
}: ArtPieceDetailsProps) {
  return (
    <article className="mx-auto max-w-2xl">
      {/* a link, because it navigates to another page */}
      <Link
        to="/art-pieces"
        className="focus-ring mb-4 inline-block rounded text-stone-700 underline-offset-4 hover:text-ink hover:underline"
      >
        ← Back to the gallery
      </Link>
      <div className="relative">
        <img
          src={image}
          alt={`${title} by ${artist}`}
          className="max-h-[32rem] w-full rounded-2xl bg-stone-200 object-contain shadow-md"
        />
        <div className="absolute top-3 right-3">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </div>
      <h2 className="mt-6 text-2xl font-bold">{title}</h2>
      <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
        <dt className="font-semibold text-stone-500">Artist</dt>
        <dd>{artist}</dd>
        <dt className="font-semibold text-stone-500">Year</dt>
        <dd>{year}</dd>
        <dt className="font-semibold text-stone-500">Genre</dt>
        <dd>{genre}</dd>
      </dl>
      <ColorPalette colors={colors} />
      <Comments comments={comments} />
      <CommentForm onSubmitComment={onAddComment} />
    </article>
  );
}
