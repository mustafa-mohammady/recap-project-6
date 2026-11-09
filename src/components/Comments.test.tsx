import { render, screen, within } from "@testing-library/react";

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
