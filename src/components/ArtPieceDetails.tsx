import { Link, useLocation } from "react-router";

import type { ArtPieceComment } from "../types";
import ColorPalette from "./ColorPalette";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import FavoriteButton from "./FavoriteButton";

function getGallerySearch(state: unknown): string {
  const search = (state as { gallerySearch?: unknown } | null)?.gallerySearch;
  return typeof search === "string" && search.startsWith("?") ? search : "";
}

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
  // without it, the comments cannot be edited
  onEditComment?: (date: string, text: string) => void;
  // without it, the comments cannot be deleted
  onDeleteComment?: (date: string) => void;
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
  onEditComment,
  onDeleteComment,
}: ArtPieceDetailsProps) {
  // set by the link of the gallery preview; missing when the page is opened
  // directly, then the back link shows the whole gallery. The history state
  // survives reloads, so only a real search like "?q=gogh" is used
  const state: unknown = useLocation().state;
  const gallerySearch = getGallerySearch(state);

  return (
    <article>
      {/* a link, because it navigates to another page */}
      <Link
        to={`/art-pieces${gallerySearch}`}
        className="focus-ring mb-5 inline-flex glass rounded-full! px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/80 hover:text-accent"
      >
        ← Back to the gallery
      </Link>
      {/* two bento tiles on wide screens: the art piece left, its info right */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-5">
        <div className="glass relative p-2 lg:sticky lg:top-28">
          <img
            src={image}
            alt={`${title} by ${artist}`}
            className="max-h-[75vh] w-full rounded-[1.25rem] bg-white/40 object-contain"
          />
          <div className="absolute top-4 right-4">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </div>
        <div className="glass p-6 sm:p-8">
          <h2 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>
          <dl className="mt-8 divide-y divide-line rounded-2xl bg-white/50 px-5 ring-1 ring-white/70">
            <div className="flex justify-between gap-6 py-3.5">
              <dt className="text-sm text-muted">Artist</dt>
              <dd className="text-right font-medium">{artist}</dd>
            </div>
            <div className="flex justify-between gap-6 py-3.5">
              <dt className="text-sm text-muted">Year</dt>
              <dd className="text-right font-medium">{year}</dd>
            </div>
            <div className="flex justify-between gap-6 py-3.5">
              <dt className="text-sm text-muted">Genre</dt>
              <dd className="text-right font-medium">{genre}</dd>
            </div>
          </dl>
          <ColorPalette colors={colors} />
          <Comments
            comments={comments}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
          />
          <CommentForm onSubmitComment={onAddComment} />
        </div>
      </div>
    </article>
  );
}
