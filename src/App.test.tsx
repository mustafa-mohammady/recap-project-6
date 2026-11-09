import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { SWRConfig } from "swr";

import App, { ART_PIECES_URL } from "./App";
import type { ArtPiece } from "./types";

const artPieces: ArtPiece[] = [
  {
    slug: "wheat-field-with-cypresses",
    artist: "Vincent van Gogh",
    name: "Wheat Field with Cypresses",
    imageSource: "https://example.com/wheat-field.jpg",
  },
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
  },
];

function renderApp(route: string) {
  render(
    // a fresh cache for every test, so the tests do not share fetched data,
    // and no retries, so a failed request does not run again after a test
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
        shouldRetryOnError: false,
      }}
    >
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </SWRConfig>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

test("shows a loading message, then all art pieces on /art-pieces", async () => {
  const fetchSpy = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(Response.json(artPieces));

  renderApp("/art-pieces");

  expect(screen.getByText("Loading art pieces…")).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: "Wheat Field with Cypresses" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "The Harvesters" })
  ).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(fetchSpy).toHaveBeenCalledWith(ART_PIECES_URL);
});

test("shows an error message when the art pieces cannot be fetched", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(null, { status: 500 })
  );

  renderApp("/art-pieces");

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Failed to load the art pieces."
  );
});

test("does not show the list on other routes", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  renderApp("/");

  expect(
    await screen.findByRole("heading", { name: "Art Gallery" })
  ).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});
