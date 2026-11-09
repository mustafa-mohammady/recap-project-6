import { Link } from "react-router";

import FavoriteButton from "./FavoriteButton";

type ArtPiecePreviewProps = {
  slug: string;
  image: string;
  title: string;
  artist: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function ArtPiecePreview({
  slug,
  image,
  title,
  artist,
  isFavorite,
  onToggleFavorite,
}: ArtPiecePreviewProps) {
  return (
    <article className="relative">
      {/* the whole preview links to the details page of the art piece */}
      <Link
        to={`/art-pieces/${slug}`}
        className="group focus-ring block rounded-2xl"
      >
        <img
          src={image}
          alt={`${title} by ${artist}`}
          className="h-56 w-full rounded-2xl object-cover shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        />
        <h2 className="mt-3 text-lg leading-snug font-semibold">{title}</h2>
        <p className="text-stone-600">{artist}</p>
      </Link>
      {/* outside the link, because a button must not be inside a link */}
      <div className="absolute top-3 right-3">
        <FavoriteButton
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </article>
  );
}
