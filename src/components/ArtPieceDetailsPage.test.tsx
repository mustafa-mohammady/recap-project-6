import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";

import type { ArtPiece, ArtPieceInfo } from "../types";
import ArtPieceDetailsPage from "./ArtPieceDetailsPage";

const artPieces: ArtPiece[] = [
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
    year: "1565",
    genre: "Genre Painting",
    colors: ["#C49A4A", "#6E7A3A", "#3E4A2A", "#D9C58C", "#8AA3B5"],
  },
];

// the page reads the slug with useParams, so it needs the dynamic route
function renderPage(
  route: string,
  artPiecesInfo: ArtPieceInfo[] = [],
  onToggleFavorite = vi.fn(),
  onAddComment = vi.fn()
) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/art-pieces/:slug"
          element={
            <ArtPieceDetailsPage
              artPieces={artPieces}
              artPiecesInfo={artPiecesInfo}
              onToggleFavorite={onToggleFavorite}
              onAddComment={onAddComment}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

test("shows the details of the art piece with the slug of the URL", () => {
  renderPage("/art-pieces/the-harvesters");

  expect(
    screen.getByRole("heading", { name: "The Harvesters" })
  ).toBeInTheDocument();
  expect(screen.getByText("1565")).toBeInTheDocument();
});

test("shows 'Art piece not found' for an unknown slug", () => {
  renderPage("/art-pieces/does-not-exist");

  expect(screen.getByText("Art piece not found")).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "← Back to the gallery" })
  ).toHaveAttribute("href", "/art-pieces");
});

test("shows a favorite button that toggles the art piece", async () => {
  const user = userEvent.setup();
  const handleToggleFavorite = vi.fn();
  renderPage(
    "/art-pieces/the-harvesters",
    [{ slug: "the-harvesters", isFavorite: true, comments: [] }],
    handleToggleFavorite
  );

  const button = screen.getByRole("button", { name: "Favorite" });
  expect(button).toHaveAttribute("aria-pressed", "true");

  await user.click(button);

  expect(handleToggleFavorite).toHaveBeenCalledWith("the-harvesters");
});

test("shows and adds the comments of the art piece", async () => {
  const user = userEvent.setup();
  const handleAddComment = vi.fn();
  renderPage(
    "/art-pieces/the-harvesters",
    [
      {
        slug: "the-harvesters",
        isFavorite: false,
        comments: [
          { text: "Wonderful colors", date: "2026-11-09T10:00:00.000Z" },
        ],
      },
    ],
    vi.fn(),
    handleAddComment
  );

  expect(screen.getByText("Wonderful colors")).toBeInTheDocument();

  await user.type(
    screen.getByRole("textbox", { name: "Add a comment" }),
    "So detailed"
  );
  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(handleAddComment).toHaveBeenCalledWith(
    "the-harvesters",
    "So detailed"
  );
});
