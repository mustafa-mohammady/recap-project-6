import { useId } from "react";

import type { ArtPieceComment } from "../types";

type CommentsProps = {
  comments: ArtPieceComment[];
};

export default function Comments({ comments }: CommentsProps) {
  // labels the section with its heading, so it is found as "Comments"
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="mt-8">
      <h3 id={headingId} className="text-lg font-semibold">
        Comments
      </h3>
      {comments.length === 0 ? (
        <p className="mt-2 text-stone-500">No comments yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {comments.map((comment) => (
            // a comment has no id, so its date and text identify it
            <li
              key={`${comment.date}-${comment.text}`}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <p className="whitespace-pre-line wrap-break-word">
                {comment.text}
              </p>
              <time
                dateTime={comment.date}
                className="mt-1 block text-sm text-stone-500"
              >
                {new Date(comment.date).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
