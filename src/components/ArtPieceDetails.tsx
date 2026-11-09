import { Link } from "react-router";

type ArtPieceDetailsProps = {
  image: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
};

export default function ArtPieceDetails({
  image,
  title,
  artist,
  year,
  genre,
}: ArtPieceDetailsProps) {
  return (
    <article className="details">
      {/* a link, because it navigates to another page */}
      <Link to="/art-pieces" className="back-link">
        ← Back to the gallery
      </Link>
      <img src={image} alt={`${title} by ${artist}`} />
      <h2>{title}</h2>
      <dl>
        <dt>Artist</dt>
        <dd>{artist}</dd>
        <dt>Year</dt>
        <dd>{year}</dd>
        <dt>Genre</dt>
        <dd>{genre}</dd>
      </dl>
    </article>
  );
}
