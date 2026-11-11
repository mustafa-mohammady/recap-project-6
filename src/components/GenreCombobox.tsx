import { useId, useState, type KeyboardEvent } from "react";

type GenreComboboxProps = {
  // the id of the field, for its <label>
  id: string;
  genres: string[];
  // none: all genres
  selectedGenres: string[];
  onSelectedGenresChange: (selectedGenres: string[]) => void;
};

// null stands for "All genres"
type GenreOption = { label: string; value: string | null };

const ALL_GENRES: GenreOption = { label: "All genres", value: null };

// what the closed field shows: nothing (the placeholder says "All genres"),
// the one chosen genre, or the number of chosen genres
function getSummary(selectedGenres: string[]): string {
  if (selectedGenres.length <= 1) {
    return selectedGenres[0] ?? "";
  }
  return `${selectedGenres.length} genres`;
}

// a select list for several genres that the user can search in: a text
// field with a list of options, built like the "combobox" pattern of the
// WAI-ARIA guide, so screen readers and the keyboard can use it
export default function GenreCombobox({
  id,
  genres,
  selectedGenres,
  onSelectedGenresChange,
}: GenreComboboxProps) {
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const search = query.trim().toLowerCase();
  const options = [
    ALL_GENRES,
    ...genres.map((name) => ({ label: name, value: name })),
  ].filter((option) => option.label.toLowerCase().includes(search));
  const activeOption = isOpen ? options[activeIndex] : undefined;
  const summary = getSummary(selectedGenres);

  function getOptionId(index: number) {
    return `${listId}-${index}`;
  }

  function isSelected(option: GenreOption) {
    return option.value === null
      ? selectedGenres.length === 0
      : selectedGenres.includes(option.value);
  }

  function close() {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  // adds or removes a genre and keeps the list open for more;
  // "All genres" removes every chosen genre
  function toggle(option: GenreOption) {
    const { value } = option;
    if (value === null) {
      onSelectedGenresChange([]);
      return;
    }
    // built from the list of all genres, so the order stays the same
    onSelectedGenresChange(
      genres.filter((name) =>
        name === value
          ? !selectedGenres.includes(name)
          : selectedGenres.includes(name)
      )
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (isOpen) {
          setActiveIndex((index) =>
            Math.max(0, Math.min(index + 1, options.length - 1))
          );
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(0, index - 1));
        break;
      case "Enter":
        if (activeOption) {
          event.preventDefault();
          toggle(activeOption);
        }
        break;
      case "Escape":
        close();
        break;
      default:
        break;
    }
  }

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeOption ? getOptionId(activeIndex) : undefined
        }
        // while searching, the field shows what the user types and the
        // chosen genres move to the placeholder
        value={isOpen ? query : summary}
        placeholder={summary || ALL_GENRES.label}
        autoComplete="off"
        onClick={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={close}
        className="h-11 w-full cursor-pointer truncate rounded-full border border-field bg-white/70 pr-10 pl-4 text-sm text-ink shadow-sm backdrop-blur transition-colors duration-200 placeholder:text-ink hover:border-ink focus:cursor-text focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none motion-reduce:transition-none"
      />
      {/* the arrow, from lucide.dev/icons/chevron-down; turns when open */}
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
        className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
      {isOpen && (
        // keeps the focus in the field on any click into the list (an option,
        // the padding, the message), so the list stays open
        <div
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-white/90 p-1.5 shadow-[0_16px_40px_rgb(49_46_129/0.16)] ring-1 ring-black/5 backdrop-blur-xl"
          onMouseDown={(event) => event.preventDefault()}
        >
          <ul
            id={listId}
            role="listbox"
            aria-label="Genres"
            aria-multiselectable="true"
            className="max-h-72 overflow-y-auto"
          >
            {options.map((option, index) => (
              <li
                key={option.label}
                id={getOptionId(index)}
                role="option"
                aria-selected={isSelected(option)}
                onClick={() => toggle(option)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm aria-selected:font-semibold aria-selected:text-accent ${index === activeIndex ? "bg-accent/10" : ""}`}
              >
                {/* a check box look: filled with a check when selected */}
                <span
                  aria-hidden="true"
                  className="grid size-4 shrink-0 place-items-center rounded-[5px] border border-field bg-white text-white group-aria-selected:border-accent group-aria-selected:bg-accent"
                >
                  {/* check icon from lucide.dev/icons/check */}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {option.label}
              </li>
            ))}
          </ul>
          {options.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted">No genres found</p>
          )}
        </div>
      )}
    </div>
  );
}
