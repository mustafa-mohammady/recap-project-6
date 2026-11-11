import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Comments from "./Comments";

const comments = [
  { text: "Wonderful colors", date: "2026-11-09T10:00:00.000Z" },
  { text: "My favorite harvest scene", date: "2026-11-09T11:30:00.000Z" },
];

test("shows a section labeled 'Comments' with every comment", () => {
  render(<Comments comments={comments} />);

  const section = screen.getByRole("region", { name: "Comments" });
  const items = within(section).getAllByRole("listitem");
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent("Wonderful colors");
  expect(items[1]).toHaveTextContent("My favorite harvest scene");
});

test("shows the date and time of each comment", () => {
  render(<Comments comments={comments} />);

  // toLocaleString depends on the language and time zone of the computer
  const expectedText = new Date(comments[0].date).toLocaleString();
  const time = screen.getByText(expectedText);
  expect(time.tagName).toBe("TIME");
  expect(time).toHaveAttribute("dateTime", comments[0].date);
});

test("shows a message when there are no comments", () => {
  render(<Comments comments={[]} />);

  expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("reports the date and the new text of an edited comment", async () => {
  const user = userEvent.setup();
  const handleEditComment = vi.fn();
  render(<Comments comments={comments} onEditComment={handleEditComment} />);

  const second = screen.getAllByRole("listitem")[1];
  await user.click(within(second).getByRole("button", { name: "Edit" }));
  await user.type(screen.getByRole("textbox", { name: "Edit comment" }), "!");

  expect(handleEditComment).toHaveBeenLastCalledWith(
    comments[1].date,
    "My favorite harvest scene!"
  );
});

test("reports the date of a deleted comment and moves the focus to the heading", async () => {
  const user = userEvent.setup();
  const handleDeleteComment = vi.fn();
  render(
    <Comments comments={comments} onDeleteComment={handleDeleteComment} />
  );

  const first = screen.getAllByRole("listitem")[0];
  await user.click(within(first).getByRole("button", { name: "Delete" }));
  await user.click(
    within(first).getByRole("button", { name: "Confirm delete" })
  );

  expect(handleDeleteComment).toHaveBeenCalledWith(comments[0].date);
  // the deleted comment takes its buttons with it, so the focus goes to
  // the heading instead of getting lost
  expect(screen.getByRole("heading", { name: "Comments" })).toHaveFocus();
});
