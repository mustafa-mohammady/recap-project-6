import { useId } from "react";

import type { ArtPieceComment } from "../types";

type CommentsProps = {
  comments: ArtPieceComment[];
};

export default function Comments({ comments }: CommentsProps) {
  // labels the section with its heading, so it is found as "Comments"
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId}>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="comments">
          {comments.map((comment) => (
            // a comment has no id, so its date and text identify it
            <li key={`${comment.date}-${comment.text}`}>
              <p>{comment.text}</p>
              <time dateTime={comment.date}>
                {new Date(comment.date).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
