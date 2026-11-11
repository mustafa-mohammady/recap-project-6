import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, useNavigate } from "react-router";

import ScrollToTop from "./ScrollToTop";

function BackButton() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)}>
      Back
    </button>
  );
}

function renderWithLinks() {
  render(
    <MemoryRouter initialEntries={["/art-pieces"]}>
      <ScrollToTop />
      <Link to="/art-pieces/the-harvesters">Details</Link>
      <Link to="/art-pieces?q=gogh">Search</Link>
      <BackButton />
    </MemoryRouter>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

test("scrolls to the top when another page opens", async () => {
  const user = userEvent.setup();
  const scrollTo = vi.spyOn(window, "scrollTo");
  renderWithLinks();
  scrollTo.mockClear();

  await user.click(screen.getByRole("link", { name: "Details" }));

  expect(scrollTo).toHaveBeenCalledWith(0, 0);
});

test("keeps the scroll position when only the search changes", async () => {
  const user = userEvent.setup();
  const scrollTo = vi.spyOn(window, "scrollTo");
  renderWithLinks();
  scrollTo.mockClear();

  await user.click(screen.getByRole("link", { name: "Search" }));

  expect(scrollTo).not.toHaveBeenCalled();
});

test("leaves the scroll position to the browser on Back", async () => {
  const user = userEvent.setup();
  const scrollTo = vi.spyOn(window, "scrollTo");
  renderWithLinks();
  await user.click(screen.getByRole("link", { name: "Details" }));
  scrollTo.mockClear();

  // Back returns to the gallery, where the user was before
  await user.click(screen.getByRole("button", { name: "Back" }));

  expect(scrollTo).not.toHaveBeenCalled();
});
