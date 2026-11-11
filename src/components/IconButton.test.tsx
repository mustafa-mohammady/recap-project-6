import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import IconButton from "./IconButton";

test("is a button named by its label, with the label as a tooltip", () => {
  render(<IconButton label="Edit" icon="edit" onClick={vi.fn()} />);

  const button = screen.getByRole("button", { name: "Edit" });
  expect(button).toHaveAttribute("title", "Edit");
  // the icon is only decoration: the label names the button
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

test("calls the function on a click", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(
    <IconButton
      label="Confirm delete"
      icon="confirm"
      variant="danger"
      onClick={handleClick}
    />
  );

  await user.click(screen.getByRole("button", { name: "Confirm delete" }));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("can take the focus as soon as it is shown", () => {
  render(
    <IconButton label="Cancel" icon="cancel" autoFocus onClick={vi.fn()} />
  );

  expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
});

test("can point to a text that describes it", () => {
  render(
    <>
      <p id="comment-text">Wonderful colors</p>
      <IconButton
        label="Edit"
        icon="edit"
        describedBy="comment-text"
        onClick={vi.fn()}
      />
    </>
  );

  expect(
    screen.getByRole("button", { name: "Edit" })
  ).toHaveAccessibleDescription("Wonderful colors");
});
