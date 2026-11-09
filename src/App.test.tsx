import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    year: "1889",
    genre: "Landscape Painting",
  },
  {
    slug: "the-harvesters",
    artist: "Pieter Bruegel the Elder",
    name: "The Harvesters",
    imageSource: "https://example.com/harvesters.jpg",
    year: "1565",
    genre: "Genre Painting",
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

test("shows one spotlight art piece and no list on /", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));
  vi.spyOn(Math, "random").mockReturnValue(0);

  renderApp("/");

  expect(
    await screen.findByRole("img", {
      name: "Wheat Field with Cypresses by Vincent van Gogh",
    })
  ).toBeInTheDocument();
  expect(screen.getByText("Vincent van Gogh")).toBeInTheDocument();
  expect(screen.getAllByRole("img")).toHaveLength(1);
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("the navigation links show the Gallery and the Spotlight", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));
  vi.spyOn(Math, "random").mockReturnValue(0);

  renderApp("/");
  await screen.findByRole("img");

  await user.click(screen.getByRole("link", { name: "Gallery" }));
  expect(screen.getAllByRole("listitem")).toHaveLength(2);

  await user.click(screen.getByRole("link", { name: "Spotlight" }));
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
  expect(screen.getAllByRole("img")).toHaveLength(1);
});

test("shows a 'Page not found' message on unknown URLs", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  renderApp("/does-not-exist");

  expect(await screen.findByText("Page not found")).toBeInTheDocument();
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});

test("shows the navigation while the art pieces are loading", () => {
  // a request that never finishes keeps the app in the loading state
  vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));

  renderApp("/");

  expect(screen.getByText("Loading art pieces…")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Spotlight" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Gallery" })).toBeInTheDocument();
});

test("an art piece links to its details and back to the list", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  renderApp("/art-pieces");
  await user.click(
    await screen.findByRole("link", { name: /The Harvesters/ })
  );

  expect(
    screen.getByRole("heading", { name: "The Harvesters" })
  ).toBeInTheDocument();
  expect(screen.getByText("1565")).toBeInTheDocument();
  expect(screen.getByText("Genre Painting")).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();

  await user.click(
    screen.getByRole("link", { name: "← Back to the gallery" })
  );

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

test("all pages share the favorite status of an art piece", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));
  vi.spyOn(Math, "random").mockReturnValue(0.5);

  // mark "The Harvesters" as a favorite in the gallery
  renderApp("/art-pieces");
  const items = await screen.findAllByRole("listitem");
  await user.click(within(items[1]).getByRole("button", { name: "Favorite" }));
  expect(
    within(items[1]).getByRole("button", { name: "Favorite" })
  ).toHaveAttribute("aria-pressed", "true");

  // the details page shows it as a favorite, and removes it again
  await user.click(screen.getByRole("link", { name: /The Harvesters/ }));
  const detailsButton = screen.getByRole("button", { name: "Favorite" });
  expect(detailsButton).toHaveAttribute("aria-pressed", "true");
  await user.click(detailsButton);
  expect(detailsButton).toHaveAttribute("aria-pressed", "false");

  // the spotlight shows the same art piece as not a favorite anymore
  await user.click(screen.getByRole("link", { name: "Spotlight" }));
  expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
});
