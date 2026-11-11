import { Link, useLocation } from "react-router";

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
  // the search of the gallery, for example "?q=gogh", goes along to the
  // details page, so its back link returns to the same search
  const { search } = useLocation();

  return (
    // the whole card, with its favorite button, lifts a little on hover
    <article className="relative h-full transition duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* the whole preview links to the details page of the art piece */}
      <Link
        to={`/art-pieces/${slug}`}
        state={{ gallerySearch: search }}
        className="glass group focus-ring block h-full p-2 transition-shadow duration-300 hover:bg-white/70 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_20px_48px_rgb(49_46_129/0.18)]"
      >
        {/* the frame stays still while the image zooms in on hover; it pulses
            until the image is loaded and covers it */}
        <div className="image-placeholder rounded-[1.25rem]">
          <img
            src={image}
            alt={`${title} by ${artist}`}
            loading="lazy"
            className="relative aspect-4/5 w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <h2 className="px-3 pt-4 font-display text-lg leading-snug font-semibold tracking-tight">
          {title}
        </h2>
        <p className="px-3 pt-0.5 pb-3 text-sm text-muted">{artist}</p>
      </Link>
      {/* outside the link, because a button must not be inside a link */}
      <div className="absolute top-4 right-4">
        <FavoriteButton
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </article>
  );
}
