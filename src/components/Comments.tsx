import { useId, useRef } from "react";

import type { ArtPieceComment } from "../types";
import CommentItem from "./CommentItem";

type CommentsProps = {
  comments: ArtPieceComment[];
  // without it, the comments cannot be edited
  onEditComment?: (date: string, text: string) => void;
  // without it, the comments cannot be deleted
  onDeleteComment?: (date: string) => void;
};

export default function Comments({
  comments,
  onEditComment,
  onDeleteComment,
}: CommentsProps) {
  // labels the section with its heading, so it is found as "Comments"
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <section aria-labelledby={headingId} className="mt-10">
      {/* tabIndex -1: the focus can move here after a delete */}
      <h3
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-2xl font-semibold tracking-tight focus:outline-none"
      >
        Comments
      </h3>
      {comments.length === 0 ? (
        <p className="mt-3 text-muted">No comments yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {comments.map((comment) => (
            // a comment has no id, so its date identifies it; not its text,
            // which changes while it is edited
            <CommentItem
              key={comment.date}
              comment={comment}
              onEdit={
                onEditComment && ((text) => onEditComment(comment.date, text))
              }
              onDelete={
                onDeleteComment &&
                (() => {
                  onDeleteComment(comment.date);
                  // the deleted comment takes its buttons with it, so the
                  // focus moves to the heading instead of getting lost
                  headingRef.current?.focus();
                })
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}
