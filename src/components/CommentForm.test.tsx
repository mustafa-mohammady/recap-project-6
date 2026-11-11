import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CommentForm from "./CommentForm";

test("submits the trimmed comment and clears the text field", async () => {
  const user = userEvent.setup();
  const handleSubmitComment = vi.fn();
  render(<CommentForm onSubmitComment={handleSubmitComment} />);

  const textField = screen.getByRole("textbox", { name: "Add a comment" });
  await user.type(textField, "  Wonderful colors  ");
  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(handleSubmitComment).toHaveBeenCalledWith("Wonderful colors");
  expect(textField).toHaveValue("");
});

test("cannot submit an empty comment", async () => {
  const user = userEvent.setup();
  const handleSubmitComment = vi.fn();
  render(<CommentForm onSubmitComment={handleSubmitComment} />);

  const button = screen.getByRole("button", { name: "Send" });
  expect(button).toBeDisabled();

  await user.type(
    screen.getByRole("textbox", { name: "Add a comment" }),
    "   "
  );
  expect(button).toBeDisabled();

  await user.click(button);
  expect(handleSubmitComment).not.toHaveBeenCalled();
});

test("ignores a submitted form with only spaces", async () => {
  const user = userEvent.setup();
  const handleSubmitComment = vi.fn();
  render(<CommentForm onSubmitComment={handleSubmitComment} />);

  const textField = screen.getByRole("textbox", { name: "Add a comment" });
  await user.type(textField, "   ");
  // submits the form directly, the way a browser can even without the button
  fireEvent.submit(textField.closest("form")!);

  expect(handleSubmitComment).not.toHaveBeenCalled();
});

test("shows how many characters are used", async () => {
  const user = userEvent.setup();
  render(<CommentForm onSubmitComment={vi.fn()} />);

  await user.type(
    screen.getByRole("textbox", { name: "Add a comment" }),
    "Hello"
  );

  expect(screen.getByText("5/150")).toBeInTheDocument();
});

test("allows at most 150 characters", async () => {
  const user = userEvent.setup();
  const handleSubmitComment = vi.fn();
  render(<CommentForm onSubmitComment={handleSubmitComment} />);

  const textField = screen.getByRole("textbox", { name: "Add a comment" });
  expect(textField).toHaveAccessibleDescription("150 characters at most");

  await user.click(textField);
  await user.paste("a".repeat(160));
  expect(textField).toHaveValue("a".repeat(150));
  expect(screen.getByText("150/150")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Send" }));
  expect(handleSubmitComment).toHaveBeenCalledWith("a".repeat(150));
});
