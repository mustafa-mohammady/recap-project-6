import { render, screen, within } from "@testing-library/react";

import ColorPalette from "./ColorPalette";

const colors = ["#37412E", "#8D7332", "#838665", "#718F98", "#9DA59E"];

test("shows every color of the art piece as an item of a list", () => {
  render(<ColorPalette colors={colors} />);

  const section = screen.getByRole("region", { name: "Color palette" });
  const items = within(section).getAllByRole("listitem");
  expect(items).toHaveLength(5);
});

test("shows each color visually as its background color", () => {
  render(<ColorPalette colors={colors} />);

  const items = screen.getAllByRole("listitem");
  colors.forEach((color, index) => {
    expect(items[index]).toHaveStyle({ backgroundColor: color });
  });
});

test("names each color for screen readers", () => {
  render(<ColorPalette colors={colors} />);

  const items = screen.getAllByRole("listitem");
  colors.forEach((color, index) => {
    expect(items[index]).toHaveTextContent(color);
    expect(items[index]).toHaveAttribute("title", color);
  });
});

test("shows an empty palette when there are no colors", () => {
  render(<ColorPalette colors={[]} />);

  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});
