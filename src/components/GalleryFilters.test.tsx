import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GalleryFilters from "./GalleryFilters";

const genres = ["Genre Painting", "Landscape Painting"];

function renderFilters({
  query = "",
  selectedGenres = [] as string[],
  onQueryChange = vi.fn(),
  onSelectedGenresChange = vi.fn(),
} = {}) {
  render(
    <GalleryFilters
      query={query}
      onQueryChange={onQueryChange}
      genres={genres}
      selectedGenres={selectedGenres}
      onSelectedGenresChange={onSelectedGenresChange}
    />
  );
}

test("shows a search field with the current search", () => {
  renderFilters({ query: "gogh" });

  expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("gogh");
});

test("reports what the user types into the search field", async () => {
  const user = userEvent.setup();
  const handleQueryChange = vi.fn();
  renderFilters({ onQueryChange: handleQueryChange });

  await user.type(screen.getByRole("searchbox", { name: "Search" }), "M");

  expect(handleQueryChange).toHaveBeenCalledWith("M");
});

test("passes the search field on to the given ref", () => {
  const searchRef = createRef<HTMLInputElement>();
  render(
    <GalleryFilters
      query=""
      onQueryChange={vi.fn()}
      genres={genres}
      selectedGenres={[]}
      onSelectedGenresChange={vi.fn()}
      searchRef={searchRef}
    />
  );

  expect(searchRef.current).toBe(
    screen.getByRole("searchbox", { name: "Search" })
  );
});

test("shows a genre field with all genres to choose from", async () => {
  const user = userEvent.setup();
  renderFilters();

  await user.click(screen.getByRole("combobox", { name: "Genre" }));

  expect(
    screen.getAllByRole("option").map((option) => option.textContent)
  ).toEqual(["All genres", "Genre Painting", "Landscape Painting"]);
});

test("shows the chosen genre", () => {
  renderFilters({ selectedGenres: ["Landscape Painting"] });

  expect(screen.getByRole("combobox", { name: "Genre" })).toHaveValue(
    "Landscape Painting"
  );
});

test("reports the genres the user chooses", async () => {
  const user = userEvent.setup();
  const handleSelectedGenresChange = vi.fn();
  renderFilters({
    selectedGenres: ["Landscape Painting"],
    onSelectedGenresChange: handleSelectedGenresChange,
  });

  await user.click(screen.getByRole("combobox", { name: "Genre" }));
  await user.click(screen.getByRole("option", { name: "Genre Painting" }));

  expect(handleSelectedGenresChange).toHaveBeenCalledWith([
    "Genre Painting",
    "Landscape Painting",
  ]);
});
