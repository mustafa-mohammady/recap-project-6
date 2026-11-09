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
    <article className="art-piece">
      {/* the whole preview links to the details page of the art piece */}
      <Link to={`/art-pieces/${slug}`}>
        <img src={image} alt={`${title} by ${artist}`} />
        <h2>{title}</h2>
        <p>{artist}</p>
      </Link>
      {/* outside the link, because a button must not be inside a link */}
      <FavoriteButton
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </article>
  );
}
