import { useId, type Ref } from "react";

import GenreCombobox from "./GenreCombobox";

type GalleryFiltersProps = {
  query: string;
  onQueryChange: (query: string) => void;
  genres: string[];
  // none: all genres
  selectedGenres: string[];
  onSelectedGenresChange: (selectedGenres: string[]) => void;
  // lets the parent move the focus to the search field
  searchRef?: Ref<HTMLInputElement>;
};

export default function GalleryFilters({
  query,
  onQueryChange,
  genres,
  selectedGenres,
  onSelectedGenresChange,
  searchRef,
}: GalleryFiltersProps) {
  const searchId = useId();
  const genreId = useId();

  return (
    // one slim row from small screens on: the search left, the genre right;
    // the labels are only for screen readers, the placeholders show the rest
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-3">
      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Search
        </label>
        {/* search icon from lucide.dev/icons/search; z-10, because the
            frosted field (backdrop-blur) would otherwise paint over it */}
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={searchRef}
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search title or artist"
          autoComplete="off"
          className="h-11 w-full rounded-full border border-field bg-white/70 pr-4 pl-10 text-sm text-ink shadow-sm backdrop-blur transition-colors duration-200 placeholder:text-muted hover:border-ink focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none motion-reduce:transition-none"
        />
      </div>
      <div>
        <label htmlFor={genreId} className="sr-only">
          Genre
        </label>
        <GenreCombobox
          id={genreId}
          genres={genres}
          selectedGenres={selectedGenres}
          onSelectedGenresChange={onSelectedGenresChange}
        />
      </div>
    </div>
  );
}
