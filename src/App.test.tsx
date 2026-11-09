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
    colors: ["#37412E", "#8D7332", "#838665", "#718F98", "#9DA59E"],
  },
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

function renderApp(route: string) {
  return render(
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

// fakes the random number, so the test knows which art piece is picked:
// with 2 art pieces, 0 picks the first and 1 picks the second
function mockRandomValue(value: number) {
  return vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
    if (array instanceof Uint32Array) {
      array[0] = value;
    }
    return array;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  // the app saves to the local storage, so every test starts with none
  localStorage.clear();
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
  mockRandomValue(0);

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
  mockRandomValue(0);

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
  await user.click(await screen.findByRole("link", { name: /The Harvesters/ }));

  expect(
    screen.getByRole("heading", { name: "The Harvesters" })
  ).toBeInTheDocument();
  expect(screen.getByText("1565")).toBeInTheDocument();
  expect(screen.getByText("Genre Painting")).toBeInTheDocument();
  // the gallery list is gone: the other art piece is not shown anymore
  expect(
    screen.queryByRole("heading", { name: "Wheat Field with Cypresses" })
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole("link", { name: "← Back to the gallery" }));

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

test("all pages share the favorite status of an art piece", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));
  mockRandomValue(1);

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

test("the Favorites page shows only the favorite art pieces", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  // mark "The Harvesters" as a favorite in the gallery
  renderApp("/art-pieces");
  const items = await screen.findAllByRole("listitem");
  await user.click(within(items[1]).getByRole("button", { name: "Favorite" }));

  await user.click(screen.getByRole("link", { name: "Favorites" }));

  const favoriteItems = screen.getAllByRole("listitem");
  expect(favoriteItems).toHaveLength(1);
  expect(
    within(favoriteItems[0]).getByRole("img", {
      name: "The Harvesters by Pieter Bruegel the Elder",
    })
  ).toBeInTheDocument();
  expect(
    within(favoriteItems[0]).getByRole("heading", { name: "The Harvesters" })
  ).toBeInTheDocument();
  expect(
    within(favoriteItems[0]).getByText("Pieter Bruegel the Elder")
  ).toBeInTheDocument();
  expect(
    within(favoriteItems[0]).getByRole("button", { name: "Favorite" })
  ).toHaveAttribute("aria-pressed", "true");
});

test("the Favorites page shows a message without favorites", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  renderApp("/art-pieces");
  const items = await screen.findAllByRole("listitem");
  await user.click(within(items[0]).getByRole("button", { name: "Favorite" }));
  await user.click(screen.getByRole("link", { name: "Favorites" }));

  await user.click(screen.getByRole("button", { name: "Favorite" }));

  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  expect(
    screen.getByText("You have no favorite art pieces yet.")
  ).toBeInTheDocument();
});

test("a comment is shown only on its own art piece", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  renderApp("/art-pieces/the-harvesters");
  await user.type(
    await screen.findByRole("textbox", { name: "Add a comment" }),
    "Look at the people resting"
  );
  await user.click(screen.getByRole("button", { name: "Send" }));

  const comments = screen.getByRole("region", { name: "Comments" });
  expect(comments).toHaveTextContent("Look at the people resting");
  expect(within(comments).getByRole("listitem")).toContainElement(
    comments.querySelector("time")
  );

  // another art piece has none of these comments
  await user.click(screen.getByRole("link", { name: "Gallery" }));
  await user.click(
    screen.getByRole("link", { name: /Wheat Field with Cypresses/ })
  );
  expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  expect(
    screen.queryByText("Look at the people resting")
  ).not.toBeInTheDocument();
});

test("the details page shows the color palette of the art piece", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  renderApp("/art-pieces/wheat-field-with-cypresses");

  const palette = await screen.findByRole("region", { name: "Color palette" });
  expect(within(palette).getAllByRole("listitem")).toHaveLength(5);
  expect(palette).toHaveTextContent("#37412E");
});

test("favorites and comments are kept after a reload", async () => {
  const user = userEvent.setup();
  // a new response for every request, because a body can be read only once
  vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    Response.json(artPieces)
  );

  const { unmount } = renderApp("/art-pieces/the-harvesters");
  await user.click(await screen.findByRole("button", { name: "Favorite" }));
  await user.type(
    screen.getByRole("textbox", { name: "Add a comment" }),
    "Still here after a reload"
  );
  await user.click(screen.getByRole("button", { name: "Send" }));

  // a reload: the app starts again from scratch
  unmount();
  renderApp("/art-pieces/the-harvesters");

  expect(
    await screen.findByRole("button", { name: "Favorite" })
  ).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Still here after a reload")).toBeInTheDocument();
});

test("the app works with broken data in the local storage", async () => {
  localStorage.setItem("art-pieces-info", "{ not json");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(artPieces));

  renderApp("/art-pieces");

  const items = await screen.findAllByRole("listitem");
  expect(items).toHaveLength(2);
  expect(
    within(items[0]).getByRole("button", { name: "Favorite" })
  ).toHaveAttribute("aria-pressed", "false");
});
