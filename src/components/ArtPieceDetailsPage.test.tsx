import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import type { ArtPiece } from "../types";
import ArtPieceDetailsPage from "./ArtPieceDetailsPage";

const artPieces: ArtPiece[] = [
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
    year: "1565",
    genre: "Genre Painting",
  },
];

// the page reads the slug with useParams, so it needs the dynamic route
function renderPage(route: string) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/art-pieces/:slug"
          element={<ArtPieceDetailsPage artPieces={artPieces} />}
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
