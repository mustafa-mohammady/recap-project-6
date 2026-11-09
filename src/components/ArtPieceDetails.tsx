import { Link } from "react-router";

import type { ArtPieceComment } from "../types";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import FavoriteButton from "./FavoriteButton";

type ArtPieceDetailsProps = {
  image: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
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
  isFavorite,
  onToggleFavorite,
  comments,
  onAddComment,
}: ArtPieceDetailsProps) {
  return (
    <article className="details">
      {/* a link, because it navigates to another page */}
      <Link to="/art-pieces" className="back-link">
        ← Back to the gallery
      </Link>
      <img src={image} alt={`${title} by ${artist}`} />
      <div className="details-header">
        <h2>{title}</h2>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
      <dl>
        <dt>Artist</dt>
        <dd>{artist}</dd>
        <dt>Year</dt>
        <dd>{year}</dd>
        <dt>Genre</dt>
        <dd>{genre}</dd>
      </dl>
      <Comments comments={comments} />
      <CommentForm onSubmitComment={onAddComment} />
    </article>
  );
}
