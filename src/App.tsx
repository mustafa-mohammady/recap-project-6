import { useState, type ReactNode } from "react";
import { Route, Routes } from "react-router";
import useSWR from "swr";

import { addComment, isFavorite, toggleFavorite } from "./artPiecesInfo";
import ArtPieceDetailsPage from "./components/ArtPieceDetailsPage";
import ArtPieceList from "./components/ArtPieceList";
import Navigation from "./components/Navigation";
import Spotlight from "./components/Spotlight";
import { fetcher } from "./fetcher";
import type { ArtPieceInfo } from "./types";
import "./styles.css";

export const ART_PIECES_URL = "https://example-apis.vercel.app/api/art";

export default function App() {
  // fetched once here and passed down, so every page can use the art pieces
  const { data: artPieces, error } = useSWR(ART_PIECES_URL, fetcher);
  // our own information (favorites and comments), shared by all pages
  const [artPiecesInfo, setArtPiecesInfo] = useState<ArtPieceInfo[]>([]);

  function handleToggleFavorite(slug: string) {
    setArtPiecesInfo((current) => toggleFavorite(current, slug));
  }

  function handleAddComment(slug: string, text: string) {
    const comment = { text, date: new Date().toISOString() };
    setArtPiecesInfo((current) => addComment(current, slug, comment));
  }

  let content: ReactNode;
  if (error) {
    content = (
      <p role="alert">Failed to load the art pieces. Please try again.</p>
    );
  } else if (!artPieces) {
    content = <p>Loading art pieces…</p>;
  } else {
    const favoriteArtPieces = artPieces.filter((artPiece) =>
      isFavorite(artPiecesInfo, artPiece.slug)
    );

    content = (
      <Routes>
        <Route
          path="/"
          element={
            <Spotlight
              artPieces={artPieces}
              artPiecesInfo={artPiecesInfo}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route
          path="/art-pieces"
          element={
            <ArtPieceList
              artPieces={artPieces}
              artPiecesInfo={artPiecesInfo}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            // the gallery list, reused with only the favorite art pieces
            favoriteArtPieces.length > 0 ? (
              <ArtPieceList
                artPieces={favoriteArtPieces}
                artPiecesInfo={artPiecesInfo}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <p>You have no favorite art pieces yet.</p>
            )
          }
        />
        <Route
          path="/art-pieces/:slug"
          element={
            <ArtPieceDetailsPage
              artPieces={artPieces}
              artPiecesInfo={artPiecesInfo}
              onToggleFavorite={handleToggleFavorite}
              onAddComment={handleAddComment}
            />
          }
        />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    );
  }

  // the layout and the navigation are rendered once, so every page shares them
  return (
    <>
      <main>
        <h1>Art Gallery</h1>
        {content}
      </main>
      <Navigation />
    </>
  );
}
