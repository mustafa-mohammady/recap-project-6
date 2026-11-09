import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FavoriteButton from "./FavoriteButton";

test("is not pressed for an art piece that is not a favorite", () => {
  render(<FavoriteButton isFavorite={false} onToggleFavorite={vi.fn()} />);

  expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
});

test("is pressed for a favorite art piece", () => {
  render(<FavoriteButton isFavorite={true} onToggleFavorite={vi.fn()} />);

  expect(screen.getByRole("button", { name: "Favorite" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
});

test("calls onToggleFavorite when it is clicked", async () => {
  const user = userEvent.setup();
  const handleToggleFavorite = vi.fn();
  render(
    <FavoriteButton
      isFavorite={false}
      onToggleFavorite={handleToggleFavorite}
    />
  );

  await user.click(screen.getByRole("button", { name: "Favorite" }));

  expect(handleToggleFavorite).toHaveBeenCalledTimes(1);
});
