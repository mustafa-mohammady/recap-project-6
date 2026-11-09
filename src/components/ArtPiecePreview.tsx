import { Link } from "react-router";

type ArtPiecePreviewProps = {
  slug: string;
  image: string;
  title: string;
  artist: string;
};

export default function ArtPiecePreview({
  slug,
  image,
  title,
  artist,
}: ArtPiecePreviewProps) {
  return (
    <article className="art-piece">
      {/* the whole preview links to the details page of the art piece */}
      <Link to={`/art-pieces/${slug}`}>
        <img src={image} alt={`${title} by ${artist}`} />
        <h2>{title}</h2>
        <p>{artist}</p>
      </Link>
    </article>
  );
}
