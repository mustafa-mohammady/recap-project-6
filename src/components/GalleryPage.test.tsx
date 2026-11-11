import { render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import type { ArtPiece } from "../types";
import GalleryPage from "./GalleryPage";

function createArtPiece(
  slug: string,
  name: string,
  artist: string,
  genre: string
): ArtPiece {
  return {
    slug,
    name,
    artist,
    genre,
    imageSource: `https://example.com/${slug}.jpg`,
    year: "1900",
    colors: [],
  };
}

const artPieces: ArtPiece[] = [
  createArtPiece(
    "wheat-field",
    "Wheat Field with Cypresses",
    "Vincent van Gogh",
    "Landscape Painting"
  ),
  createArtPiece(
    "the-harvesters",
    "The Harvesters",
    "Pieter Bruegel the Elder",
    "Genre Painting"
  ),
  createArtPiece(
    "starry-night",
    "The Starry Night",
    "Vincent van Gogh",
    "Landscape Painting"
  ),
];

// opens the genre field and clicks a genre in its list
async function chooseGenre(user: UserEvent, name: string) {
  await user.click(screen.getByRole("combobox", { name: "Genre" }));
  await user.click(screen.getByRole("option", { name }));
}

function renderGalleryPage(route = "/art-pieces", onToggleFavorite = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <GalleryPage
        artPieces={artPieces}
        artPiecesInfo={[]}
        onToggleFavorite={onToggleFavorite}
      />
    </MemoryRouter>
  );
}

function getTitles() {
  return screen
    .getAllByRole("listitem")
    .map((item) => within(item).getByRole("heading").textContent);
}

test("shows the filters, the number and all art pieces", () => {
  renderGalleryPage();

  expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
  expect(screen.getByRole("combobox", { name: "Genre" })).toHaveValue("");
  expect(screen.getByText("3 art pieces")).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

test("shows only the art pieces that match the search", async () => {
  const user = userEvent.setup();
  renderGalleryPage();

  await user.type(screen.getByRole("searchbox", { name: "Search" }), "gogh");

  expect(getTitles()).toEqual([
    "Wheat Field with Cypresses",
    "The Starry Night",
  ]);
  expect(screen.getByText("2 art pieces")).toBeInTheDocument();
});

test("shows all art pieces again when the search is cleared", async () => {
  const user = userEvent.setup();
  renderGalleryPage();
  const search = screen.getByRole("searchbox", { name: "Search" });

  await user.type(search, "harvest");
  await user.clear(search);

  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

test("shows only the art pieces of the chosen genre", async () => {
  const user = userEvent.setup();
  renderGalleryPage();

  await chooseGenre(user, "Genre Painting");

  expect(getTitles()).toEqual(["The Harvesters"]);
  // one art piece: the singular
  expect(screen.getByText("1 art piece")).toBeInTheDocument();

  await chooseGenre(user, "All genres");

  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

test("shows the art pieces of several chosen genres", async () => {
  const user = userEvent.setup();
  const pieces = [
    ...artPieces,
    createArtPiece("mona-lisa", "Mona Lisa", "Leonardo da Vinci", "Portrait"),
  ];
  render(
    <MemoryRouter initialEntries={["/art-pieces"]}>
      <GalleryPage
        artPieces={pieces}
        artPiecesInfo={[]}
        onToggleFavorite={vi.fn()}
      />
    </MemoryRouter>
  );

  await chooseGenre(user, "Genre Painting");
  await chooseGenre(user, "Portrait");

  expect(getTitles()).toEqual(["The Harvesters", "Mona Lisa"]);
  expect(screen.getByText("2 art pieces")).toBeInTheDocument();
});

test("reads several genres from the URL", () => {
  renderGalleryPage(
    "/art-pieces?genre=Genre+Painting&genre=Landscape+Painting"
  );

  expect(screen.getByRole("combobox", { name: "Genre" })).toHaveValue(
    "2 genres"
  );
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

test("reads the search and the genre from the URL", () => {
  renderGalleryPage("/art-pieces?q=the&genre=Landscape+Painting");

  expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("the");
  expect(screen.getByRole("combobox", { name: "Genre" })).toHaveValue(
    "Landscape Painting"
  );
  expect(getTitles()).toEqual(["The Starry Night"]);
});

test("shows a message and clears the filters when nothing matches", async () => {
  const user = userEvent.setup();
  renderGalleryPage("/art-pieces?q=mona+lisa&genre=Genre+Painting");

  expect(screen.queryByRole("list")).not.toBeInTheDocument();
  expect(
    screen.getByText("No art pieces match your search.")
  ).toBeInTheDocument();
  // a next step instead of a dead end
  expect(
    screen.getByText("Try another title or artist, or clear the filters.")
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Clear filters" }));

  const search = screen.getByRole("searchbox", { name: "Search" });
  expect(search).toHaveValue("");
  // the button is gone, so the focus moves to the search field
  expect(search).toHaveFocus();
  expect(screen.getByRole("combobox", { name: "Genre" })).toHaveValue("");
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

test("shows all genres for an empty genre in the URL", () => {
  renderGalleryPage("/art-pieces?genre=");

  expect(screen.getByRole("combobox", { name: "Genre" })).toHaveValue("");
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

test("passes the favorite button click on with the slug", async () => {
  const user = userEvent.setup();
  const handleToggleFavorite = vi.fn();
  renderGalleryPage("/art-pieces?q=harvest", handleToggleFavorite);

  await user.click(screen.getByRole("button", { name: "Favorite" }));

  expect(handleToggleFavorite).toHaveBeenCalledWith("the-harvesters");
});
