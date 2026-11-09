type ArtPiecePreviewProps = {
  image: string;
  title: string;
  artist: string;
};

export default function ArtPiecePreview({
  image,
  title,
  artist,
}: ArtPiecePreviewProps) {
  return (
    <article className="art-piece">
      <img src={image} alt={`${title} by ${artist}`} />
      <h2>{title}</h2>
      <p>{artist}</p>
    </article>
  );
}
