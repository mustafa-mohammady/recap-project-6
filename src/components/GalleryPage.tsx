import { useRef } from "react";
import { useSearchParams } from "react-router";

import { filterArtPieces, getGenres } from "../filterArtPieces";
import type { ArtPiece, ArtPieceInfo } from "../types";
import ArtPieceList from "./ArtPieceList";
import GalleryFilters from "./GalleryFilters";

type GalleryPageProps = {
  artPieces: ArtPiece[];
  artPiecesInfo: ArtPieceInfo[];
  onToggleFavorite: (slug: string) => void;
};

export default function GalleryPage({
  artPieces,
  artPiecesInfo,
  onToggleFavorite,
}: GalleryPageProps) {
  // the filters live in the URL, one "genre" per chosen genre
  // (/art-pieces?q=gogh&genre=Portrait&genre=Landscape+Painting), so they are
  // kept when the user comes back and can be shared as a link
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  // an empty ?genre= is no genre
  const selectedGenres = searchParams.getAll("genre").filter(Boolean);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredArtPieces = filterArtPieces(artPieces, {
    query,
    genres: selectedGenres,
  });
  const count = filteredArtPieces.length;

  // replaces all values of a parameter; no values remove it, so the URL
  // stays short; replace: typing does not add a history entry per letter
  function updateSearchParam(name: string, values: string[]) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(name);
        for (const value of values) {
          next.append(name, value);
        }
        return next;
      },
      { replace: true }
    );
  }

  function handleClearFilters() {
    setSearchParams({}, { replace: true });
    // the button disappears with the empty state, so the focus would get
    // lost; the search field is where the user most likely continues
    searchRef.current?.focus();
  }

  return (
    <>
      <div className="mb-6">
        <GalleryFilters
          query={query}
          onQueryChange={(newQuery) =>
            updateSearchParam("q", newQuery ? [newQuery] : [])
          }
          genres={getGenres(artPieces)}
          selectedGenres={selectedGenres}
          onSelectedGenresChange={(newGenres) =>
            updateSearchParam("genre", newGenres)
          }
          searchRef={searchRef}
        />
        {/* below the filters; aria-live: screen readers announce the new
            number while typing */}
        <p aria-live="polite" className="mt-3 px-1 text-sm text-muted">
          {count === 1 ? "1 art piece" : `${count} art pieces`}
        </p>
      </div>
      {count > 0 ? (
        <ArtPieceList
          artPieces={filteredArtPieces}
          artPiecesInfo={artPiecesInfo}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="glass px-6 py-20 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">
            No art pieces match your search.
          </p>
          <p className="mt-2 text-muted">
            Try another title or artist, or clear the filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="focus-ring mt-6 cursor-pointer rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition duration-200 hover:bg-accent-strong motion-reduce:transition-none"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
