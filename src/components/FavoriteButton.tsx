type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function FavoriteButton({
  isFavorite,
  onToggleFavorite,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      // aria-pressed tells screen readers whether the button is on,
      // and aria-pressed: colors the heart red when it is "true"
      aria-pressed={isFavorite}
      aria-label="Favorite"
      onClick={onToggleFavorite}
      className="focus-ring grid size-11 cursor-pointer place-items-center rounded-full bg-white/90 text-stone-600 shadow-md backdrop-blur transition hover:scale-110 aria-pressed:text-rose-600 motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      {/* heart icon from lucide.dev/icons/heart, filled when favorite */}
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
