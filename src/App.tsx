import { useEffect, useState, type ReactNode } from "react";
import { Route, Routes } from "react-router";
import useSWR from "swr";

import {
  addComment,
  deleteComment,
  editComment,
  isFavorite,
  toggleFavorite,
} from "./artPiecesInfo";
import { loadArtPiecesInfo, saveArtPiecesInfo } from "./artPiecesInfoStorage";
import ArtPieceDetailsPage from "./components/ArtPieceDetailsPage";
import ArtPieceList from "./components/ArtPieceList";
import GalleryPage from "./components/GalleryPage";
import Loader from "./components/Loader";
import Navigation from "./components/Navigation";
import ScrollToTop from "./components/ScrollToTop";
import Spotlight from "./components/Spotlight";
import { fetcher } from "./fetcher";
import type { ArtPieceInfo } from "./types";
// the fonts are served by the app itself, not by Google, so no visitor data
// goes to a third party
import "@fontsource-variable/outfit";
import "@fontsource-variable/inter";
import "./styles.css";

export const ART_PIECES_URL = "https://example-apis.vercel.app/api/art";

export default function App() {
  // fetched once here and passed down, so every page can use the art pieces
  const { data: artPieces, error } = useSWR(ART_PIECES_URL, fetcher);
  // our own information (favorites and comments), shared by all pages;
  // the function is passed, so the local storage is read only once
  const [artPiecesInfo, setArtPiecesInfo] =
    useState<ArtPieceInfo[]>(loadArtPiecesInfo);

  // saves the information whenever it changes, so it survives a reload
  useEffect(() => {
    saveArtPiecesInfo(artPiecesInfo);
  }, [artPiecesInfo]);

  function handleToggleFavorite(slug: string) {
    setArtPiecesInfo((current) => toggleFavorite(current, slug));
  }

  function handleAddComment(slug: string, text: string) {
    const comment = { text, date: new Date().toISOString() };
    setArtPiecesInfo((current) => addComment(current, slug, comment));
  }

  // called with every change while the user types, so the edit is saved
  // (and kept after a reload) in real time
  function handleEditComment(slug: string, date: string, text: string) {
    const editedDate = new Date().toISOString();
    setArtPiecesInfo((current) =>
      editComment(current, slug, date, text, editedDate)
    );
  }

  function handleDeleteComment(slug: string, date: string) {
    setArtPiecesInfo((current) => deleteComment(current, slug, date));
  }

  let content: ReactNode;
  if (error) {
    content = (
      <p
        role="alert"
        className="glass mx-auto max-w-md p-5 text-center font-medium text-red-700"
      >
        Failed to load the art pieces. Please try again.
      </p>
    );
  } else if (!artPieces) {
    content = <Loader message="Loading art pieces…" />;
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
            <GalleryPage
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
              <p className="glass px-6 py-20 text-center font-display text-2xl font-semibold tracking-tight text-muted">
                You have no favorite art pieces yet.
              </p>
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
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
            />
          }
        />
        <Route
          path="*"
          element={
            <p className="glass px-6 py-20 text-center font-display text-2xl font-semibold tracking-tight text-muted">
              Page not found
            </p>
          }
        />
      </Routes>
    );
  }

  // the layout and the navigation are rendered once, so every page shares them
  return (
    <>
      <ScrollToTop />
      {/* a floating, frosted pill: the page scrolls under it */}
      <header className="sticky top-0 z-20 px-4 pt-3 sm:pt-4">
        <div className="glass mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-3 sm:flex-row sm:justify-between sm:rounded-full! sm:py-2 sm:pr-2 sm:pl-6">
          <h1 className="font-display text-lg font-bold tracking-tight text-accent">
            Art Gallery
          </h1>
          <Navigation />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:pt-12">
        {content}
      </main>
    </>
  );
}
