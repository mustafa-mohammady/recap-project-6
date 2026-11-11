import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GenreCombobox from "./GenreCombobox";

const genres = ["Genre Painting", "Landscape Painting", "Portrait"];

function renderCombobox({
  selectedGenres = [] as string[],
  onSelectedGenresChange = vi.fn(),
} = {}) {
  render(
    <>
      <label htmlFor="genre">Genre</label>
      <GenreCombobox
        id="genre"
        genres={genres}
        selectedGenres={selectedGenres}
        onSelectedGenresChange={onSelectedGenresChange}
      />
    </>
  );
  return screen.getByRole("combobox", { name: "Genre" });
}

function getOptionNames() {
  return screen.getAllByRole("option").map((option) => option.textContent);
}

test("is empty for all genres and shows them as the placeholder", () => {
  const combobox = renderCombobox();

  expect(combobox).toHaveValue("");
  expect(combobox).toHaveAttribute("placeholder", "All genres");
  expect(combobox).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("shows one chosen genre by its name", () => {
  expect(renderCombobox({ selectedGenres: ["Portrait"] })).toHaveValue(
    "Portrait"
  );
});

test("shows several chosen genres by their number", () => {
  expect(
    renderCombobox({ selectedGenres: ["Genre Painting", "Portrait"] })
  ).toHaveValue("2 genres");
});

test("opens a list of all genres with several choices on a click", async () => {
  const user = userEvent.setup();
  const combobox = renderCombobox();

  await user.click(combobox);

  expect(combobox).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("listbox", { name: "Genres" })).toHaveAttribute(
    "aria-multiselectable",
    "true"
  );
  expect(getOptionNames()).toEqual(["All genres", ...genres]);
});

test("marks 'All genres' as selected without chosen genres", async () => {
  const user = userEvent.setup();
  await user.click(renderCombobox());

  expect(screen.getByRole("option", { name: "All genres" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

test("marks every chosen genre as selected", async () => {
  const user = userEvent.setup();
  await user.click(
    renderCombobox({ selectedGenres: ["Genre Painting", "Portrait"] })
  );

  expect(
    screen
      .getAllByRole("option", { selected: true })
      .map((option) => option.textContent)
  ).toEqual(["Genre Painting", "Portrait"]);
});

test("shows only the genres that match what the user types", async () => {
  const user = userEvent.setup();
  const combobox = renderCombobox();

  await user.type(combobox, "  PAINT");

  expect(getOptionNames()).toEqual(["Genre Painting", "Landscape Painting"]);
});

test("shows a message when no genre matches", async () => {
  const user = userEvent.setup();
  await user.type(renderCombobox(), "sculpture");

  expect(screen.queryByRole("option")).not.toBeInTheDocument();
  expect(screen.getByText("No genres found")).toBeInTheDocument();
});

test("adds a clicked genre and keeps the list open for more", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  const combobox = renderCombobox({ onSelectedGenresChange: handleChange });

  await user.click(combobox);
  await user.click(screen.getByRole("option", { name: "Portrait" }));

  expect(handleChange).toHaveBeenCalledWith(["Portrait"]);
  expect(combobox).toHaveAttribute("aria-expanded", "true");
  // the focus stays in the field
  expect(combobox).toHaveFocus();
});

test("keeps the chosen genres in the order of the list", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  const combobox = renderCombobox({
    selectedGenres: ["Portrait"],
    onSelectedGenresChange: handleChange,
  });

  await user.click(combobox);
  await user.click(screen.getByRole("option", { name: "Genre Painting" }));

  expect(handleChange).toHaveBeenCalledWith(["Genre Painting", "Portrait"]);
});

test("removes a chosen genre on a second click", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  const combobox = renderCombobox({
    selectedGenres: ["Genre Painting", "Portrait"],
    onSelectedGenresChange: handleChange,
  });

  await user.click(combobox);
  await user.click(screen.getByRole("option", { name: "Portrait" }));

  expect(handleChange).toHaveBeenCalledWith(["Genre Painting"]);
});

test("removes all chosen genres with 'All genres'", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  const combobox = renderCombobox({
    selectedGenres: ["Portrait"],
    onSelectedGenresChange: handleChange,
  });

  await user.click(combobox);
  await user.click(screen.getByRole("option", { name: "All genres" }));

  expect(handleChange).toHaveBeenCalledWith([]);
});

test("can be used with the keyboard only", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  const combobox = renderCombobox({ onSelectedGenresChange: handleChange });

  await user.tab();
  // the arrow down key opens the list, with the first option active
  await user.keyboard("{ArrowDown}");
  expect(combobox).toHaveAttribute("aria-expanded", "true");
  expect(combobox).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "All genres" }).id
  );

  await user.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}");
  expect(combobox).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Genre Painting" }).id
  );

  // Enter chooses the active genre; the list stays open for more
  await user.keyboard("{Enter}");
  expect(handleChange).toHaveBeenCalledWith(["Genre Painting"]);
  expect(combobox).toHaveAttribute("aria-expanded", "true");
});

test("keeps the active option inside the list", async () => {
  const user = userEvent.setup();
  const combobox = renderCombobox();

  await user.type(combobox, "portrait");
  await user.keyboard("{ArrowUp}{ArrowDown}{ArrowDown}");

  expect(combobox).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Portrait" }).id
  );
});

test("the active option follows the mouse", async () => {
  const user = userEvent.setup();
  const combobox = renderCombobox();

  await user.click(combobox);
  await user.hover(screen.getByRole("option", { name: "Portrait" }));

  expect(combobox).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Portrait" }).id
  );
});

test("does nothing on Enter without a matching genre", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  const combobox = renderCombobox({ onSelectedGenresChange: handleChange });

  await user.type(combobox, "sculpture{ArrowDown}{Enter}");

  expect(handleChange).not.toHaveBeenCalled();
  expect(combobox).not.toHaveAttribute("aria-activedescendant");
});

test("closes without a change on Escape", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  const combobox = renderCombobox({
    selectedGenres: ["Portrait"],
    onSelectedGenresChange: handleChange,
  });

  await user.type(combobox, "land{Escape}");

  expect(combobox).toHaveAttribute("aria-expanded", "false");
  expect(combobox).toHaveValue("Portrait");
  expect(handleChange).not.toHaveBeenCalled();
});

test("closes when the focus leaves the field", async () => {
  const user = userEvent.setup();
  const combobox = renderCombobox();

  await user.click(combobox);
  await user.tab();

  expect(combobox).toHaveAttribute("aria-expanded", "false");
});

test("ignores other keys for the list", async () => {
  const user = userEvent.setup();
  const combobox = renderCombobox();

  await user.click(combobox);
  await user.keyboard("{ArrowDown}{Shift}");

  expect(combobox).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "Genre Painting" }).id
  );
});

test("stays open when the user clicks the list outside an option", async () => {
  const user = userEvent.setup();
  const combobox = renderCombobox();

  await user.type(combobox, "sculpture");
  await user.click(screen.getByText("No genres found"));

  expect(combobox).toHaveAttribute("aria-expanded", "true");
  expect(combobox).toHaveFocus();
});
