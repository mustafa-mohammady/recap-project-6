// one art piece of the API, only with the properties the app uses
export type ArtPiece = {
  slug: string;
  artist: string;
  name: string;
  imageSource: string;
  year: string;
  genre: string;
  // hex colors used in the image, for example "#37412E"
  colors: string[];
};

export type ArtPieceComment = {
  text: string;
  // an ISO date string, from new Date().toISOString()
  date: string;
  // the same kind of date, set when the text was changed
  editedDate?: string;
};

// our own information about an art piece, connected to it by the slug
export type ArtPieceInfo = {
  slug: string;
  isFavorite: boolean;
  comments: ArtPieceComment[];
};
