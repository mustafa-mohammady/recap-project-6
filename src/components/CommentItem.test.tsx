import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { ArtPieceComment } from "../types";
import CommentItem from "./CommentItem";

const comment: ArtPieceComment = {
  text: "Wonderful colors",
  date: "2026-11-09T10:00:00.000Z",
};

function renderItem(
  onEdit?: (text: string) => void,
  item = comment,
  onDelete?: () => void
) {
  render(
    <ul>
      <CommentItem comment={item} onEdit={onEdit} onDelete={onDelete} />
    </ul>
  );
}

test("shows the text and the date of the comment", () => {
  renderItem();

  expect(screen.getByText("Wonderful colors")).toBeInTheDocument();
  expect(
    screen.getByText(new Date(comment.date).toLocaleString())
  ).toHaveAttribute("dateTime", comment.date);
});

test("has no edit button without an edit function", () => {
  renderItem();

  expect(
    screen.queryByRole("button", { name: "Edit" })
  ).not.toBeInTheDocument();
});

test("marks a comment that was edited", () => {
  renderItem(undefined, {
    ...comment,
    editedDate: "2026-11-11T09:00:00.000Z",
  });

  expect(screen.getByText("· edited")).toBeInTheDocument();
});

test("opens a field with the text, ready to type, on Edit", async () => {
  const user = userEvent.setup();
  renderItem(vi.fn());

  await user.click(screen.getByRole("button", { name: "Edit" }));

  const field = screen.getByRole("textbox", { name: "Edit comment" });
  expect(field).toHaveValue("Wonderful colors");
  expect(field).toHaveFocus();
  expect(screen.getByText("Saved as you type")).toBeInTheDocument();
});

test("saves every change while the user types", async () => {
  const user = userEvent.setup();
  const handleEdit = vi.fn();
  renderItem(handleEdit);

  await user.click(screen.getByRole("button", { name: "Edit" }));
  await user.type(
    screen.getByRole("textbox", { name: "Edit comment" }),
    " here"
  );

  // one save per change of the text: the first space alone changes
  // nothing once trimmed, so it is not saved
  expect(handleEdit).toHaveBeenCalledTimes(4);
  expect(handleEdit).toHaveBeenNthCalledWith(1, "Wonderful colors h");
  expect(handleEdit).toHaveBeenLastCalledWith("Wonderful colors here");
});

test("does not save an empty text", async () => {
  const user = userEvent.setup();
  const handleEdit = vi.fn();
  renderItem(handleEdit);

  await user.click(screen.getByRole("button", { name: "Edit" }));
  await user.clear(screen.getByRole("textbox", { name: "Edit comment" }));
  await user.type(screen.getByRole("textbox", { name: "Edit comment" }), "   ");

  expect(handleEdit).not.toHaveBeenCalled();
});

test("closes the field on Done and puts the focus back on Edit", async () => {
  const user = userEvent.setup();
  renderItem(vi.fn());

  await user.click(screen.getByRole("button", { name: "Edit" }));
  await user.click(screen.getByRole("button", { name: "Done" }));

  expect(
    screen.queryByRole("textbox", { name: "Edit comment" })
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Edit" })).toHaveFocus();
});

test("closes the field on Escape", async () => {
  const user = userEvent.setup();
  renderItem(vi.fn());

  await user.click(screen.getByRole("button", { name: "Edit" }));
  await user.keyboard("{Escape}");

  expect(
    screen.queryByRole("textbox", { name: "Edit comment" })
  ).not.toBeInTheDocument();
});

test("keeps the field open on other keys", async () => {
  const user = userEvent.setup();
  renderItem(vi.fn());

  await user.click(screen.getByRole("button", { name: "Edit" }));
  await user.keyboard("{Enter}");

  expect(
    screen.getByRole("textbox", { name: "Edit comment" })
  ).toBeInTheDocument();
});

test("has no delete button without a delete function", () => {
  renderItem(vi.fn());

  expect(
    screen.queryByRole("button", { name: "Delete" })
  ).not.toBeInTheDocument();
});

test("asks before it deletes, with the focus on Cancel", async () => {
  const user = userEvent.setup();
  const handleDelete = vi.fn();
  renderItem(undefined, comment, handleDelete);

  await user.click(screen.getByRole("button", { name: "Delete" }));

  expect(screen.getByText("Delete this comment?")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  expect(handleDelete).not.toHaveBeenCalled();
});

test("deletes the comment when the user confirms", async () => {
  const user = userEvent.setup();
  const handleDelete = vi.fn();
  renderItem(undefined, comment, handleDelete);

  await user.click(screen.getByRole("button", { name: "Delete" }));
  await user.click(screen.getByRole("button", { name: "Confirm delete" }));

  expect(handleDelete).toHaveBeenCalledTimes(1);
});

test("keeps the comment on Cancel and puts the focus back on Delete", async () => {
  const user = userEvent.setup();
  const handleDelete = vi.fn();
  renderItem(undefined, comment, handleDelete);

  await user.click(screen.getByRole("button", { name: "Delete" }));
  await user.click(screen.getByRole("button", { name: "Cancel" }));

  expect(handleDelete).not.toHaveBeenCalled();
  expect(screen.queryByText("Delete this comment?")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
});

test("allows at most 150 characters while editing", async () => {
  const user = userEvent.setup();
  const handleEdit = vi.fn();
  renderItem(handleEdit);

  await user.click(screen.getByRole("button", { name: "Edit" }));
  const field = screen.getByRole("textbox", { name: "Edit comment" });
  expect(field).toHaveAccessibleDescription("150 characters at most");
  expect(screen.getByText("16/150")).toBeInTheDocument();

  await user.clear(field);
  await user.paste("b".repeat(160));

  expect(field).toHaveValue("b".repeat(150));
  expect(handleEdit).toHaveBeenLastCalledWith("b".repeat(150));
});

// a comment that really changes when it is edited, like in the app
function EditableItem() {
  const [item, setItem] = useState(comment);
  return (
    <ul>
      <CommentItem
        comment={item}
        onEdit={(text) =>
          setItem({ ...item, text, editedDate: "2026-11-11T09:00:00.000Z" })
        }
      />
    </ul>
  );
}

test("gets back the old text when the field is left empty", async () => {
  const user = userEvent.setup();
  render(<EditableItem />);

  await user.click(screen.getByRole("button", { name: "Edit" }));
  // deleting letter by letter saves "W" before the field is empty
  await user.type(
    screen.getByRole("textbox", { name: "Edit comment" }),
    "{Backspace>16/}"
  );
  await user.click(screen.getByRole("button", { name: "Done" }));

  expect(screen.getByText("Wonderful colors")).toBeInTheDocument();
});

test("describes the buttons with the text of the comment", () => {
  renderItem(vi.fn(), comment, vi.fn());

  expect(
    screen.getByRole("button", { name: "Edit" })
  ).toHaveAccessibleDescription("Wonderful colors");
  expect(
    screen.getByRole("button", { name: "Delete" })
  ).toHaveAccessibleDescription("Wonderful colors");
});

test("tells screen readers what the delete buttons are about", async () => {
  const user = userEvent.setup();
  renderItem(undefined, comment, vi.fn());

  await user.click(screen.getByRole("button", { name: "Delete" }));

  expect(
    screen.getByRole("button", { name: "Cancel" })
  ).toHaveAccessibleDescription("Delete this comment? Wonderful colors");
  expect(
    screen.getByRole("button", { name: "Confirm delete" })
  ).toHaveAccessibleDescription("Delete this comment? Wonderful colors");
});

test("cancels the delete on Escape", async () => {
  const user = userEvent.setup();
  const handleDelete = vi.fn();
  renderItem(undefined, comment, handleDelete);

  await user.click(screen.getByRole("button", { name: "Delete" }));
  await user.keyboard("{Escape}");

  expect(screen.queryByText("Delete this comment?")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
  expect(handleDelete).not.toHaveBeenCalled();
});

test("keeps the delete question open on other keys", async () => {
  const user = userEvent.setup();
  renderItem(undefined, comment, vi.fn());

  await user.click(screen.getByRole("button", { name: "Delete" }));
  await user.keyboard("{Shift}");

  expect(screen.getByText("Delete this comment?")).toBeInTheDocument();
});
