import {
  addComment,
  deleteComment,
  editComment,
  getComments,
  isFavorite,
  toggleFavorite,
} from "./artPiecesInfo";
import type { ArtPieceComment, ArtPieceInfo } from "./types";

const firstComment: ArtPieceComment = {
  text: "Wonderful colors",
  date: "2026-11-09T10:00:00.000Z",
};
const secondComment: ArtPieceComment = {
  text: "My favorite harvest scene",
  date: "2026-11-09T11:00:00.000Z",
};

const artPiecesInfo: ArtPieceInfo[] = [
  { slug: "the-harvesters", isFavorite: true, comments: [firstComment] },
  { slug: "the-night-watch", isFavorite: false, comments: [] },
];

describe("isFavorite", () => {
  test("is true for a favorite art piece", () => {
    expect(isFavorite(artPiecesInfo, "the-harvesters")).toBe(true);
  });

  test("is false for an art piece that is not a favorite anymore", () => {
    expect(isFavorite(artPiecesInfo, "the-night-watch")).toBe(false);
  });

  test("is false for an art piece without any information", () => {
    expect(isFavorite(artPiecesInfo, "unknown")).toBe(false);
  });
});

describe("toggleFavorite", () => {
  test("adds an art piece without information as a favorite", () => {
    expect(toggleFavorite(artPiecesInfo, "unknown")).toEqual([
      ...artPiecesInfo,
      { slug: "unknown", isFavorite: true, comments: [] },
    ]);
  });

  test("removes a favorite art piece and keeps its comments", () => {
    expect(toggleFavorite(artPiecesInfo, "the-harvesters")).toContainEqual({
      slug: "the-harvesters",
      isFavorite: false,
      comments: [firstComment],
    });
  });

  test("marks an art piece that is not a favorite as a favorite", () => {
    expect(toggleFavorite(artPiecesInfo, "the-night-watch")).toContainEqual({
      slug: "the-night-watch",
      isFavorite: true,
      comments: [],
    });
  });
});

describe("getComments", () => {
  test("returns the comments of the art piece", () => {
    expect(getComments(artPiecesInfo, "the-harvesters")).toEqual([
      firstComment,
    ]);
  });

  test("returns no comments for an art piece without information", () => {
    expect(getComments(artPiecesInfo, "unknown")).toEqual([]);
  });
});

describe("addComment", () => {
  test("adds the comment after the others and keeps the favorite", () => {
    expect(
      addComment(artPiecesInfo, "the-harvesters", secondComment)
    ).toContainEqual({
      slug: "the-harvesters",
      isFavorite: true,
      comments: [firstComment, secondComment],
    });
  });

  test("adds the comment only to the given art piece", () => {
    const result = addComment(artPiecesInfo, "the-harvesters", secondComment);

    expect(getComments(result, "the-night-watch")).toEqual([]);
  });

  test("adds an art piece without information, not as a favorite", () => {
    expect(addComment(artPiecesInfo, "unknown", secondComment)).toEqual([
      ...artPiecesInfo,
      { slug: "unknown", isFavorite: false, comments: [secondComment] },
    ]);
  });
});

test("toggleFavorite and addComment do not change the given list", () => {
  const before = structuredClone(artPiecesInfo);

  toggleFavorite(artPiecesInfo, "the-harvesters");
  addComment(artPiecesInfo, "the-harvesters", secondComment);

  expect(artPiecesInfo).toEqual(before);
});

describe("editComment", () => {
  const editedDate = "2026-11-11T09:00:00.000Z";
  const info: ArtPieceInfo[] = [
    {
      slug: "the-harvesters",
      isFavorite: true,
      comments: [firstComment, secondComment],
    },
    { slug: "the-night-watch", isFavorite: false, comments: [firstComment] },
  ];

  test("changes the text of the comment with the date and marks it edited", () => {
    expect(
      getComments(
        editComment(
          info,
          "the-harvesters",
          secondComment.date,
          "Changed text",
          editedDate
        ),
        "the-harvesters"
      )
    ).toEqual([
      firstComment,
      { ...secondComment, text: "Changed text", editedDate },
    ]);
  });

  test("changes only the comment of the given art piece", () => {
    const result = editComment(
      info,
      "the-harvesters",
      firstComment.date,
      "Changed text",
      editedDate
    );

    // the same date on another art piece stays as it was
    expect(getComments(result, "the-night-watch")).toEqual([firstComment]);
    expect(isFavorite(result, "the-harvesters")).toBe(true);
  });

  test("changes nothing for an unknown art piece or date", () => {
    expect(
      editComment(info, "unknown", firstComment.date, "Changed", editedDate)
    ).toEqual(info);
    expect(
      editComment(info, "the-harvesters", "unknown", "Changed", editedDate)
    ).toEqual(info);
  });

  test("does not change the given list", () => {
    const before = structuredClone(info);

    editComment(
      info,
      "the-harvesters",
      firstComment.date,
      "Changed",
      editedDate
    );

    expect(info).toEqual(before);
  });
});

describe("deleteComment", () => {
  const info: ArtPieceInfo[] = [
    {
      slug: "the-harvesters",
      isFavorite: true,
      comments: [firstComment, secondComment],
    },
    { slug: "the-night-watch", isFavorite: false, comments: [firstComment] },
  ];

  test("removes the comment with the date and keeps the others", () => {
    const result = deleteComment(info, "the-harvesters", firstComment.date);

    expect(getComments(result, "the-harvesters")).toEqual([secondComment]);
    expect(isFavorite(result, "the-harvesters")).toBe(true);
    // the same date on another art piece stays
    expect(getComments(result, "the-night-watch")).toEqual([firstComment]);
  });

  test("changes nothing for an unknown art piece or date", () => {
    expect(deleteComment(info, "unknown", firstComment.date)).toEqual(info);
    expect(deleteComment(info, "the-harvesters", "unknown")).toEqual(info);
  });

  test("does not change the given list", () => {
    const before = structuredClone(info);

    deleteComment(info, "the-harvesters", firstComment.date);

    expect(info).toEqual(before);
  });
});
