import { useId, useState, type FormEvent } from "react";

import { MAX_COMMENT_LENGTH } from "../artPiecesInfo";
import CharacterCount from "./CharacterCount";

type CommentFormProps = {
  onSubmitComment: (text: string) => void;
};

export default function CommentForm({ onSubmitComment }: CommentFormProps) {
  const [text, setText] = useState("");
  const countId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // a comment with only spaces counts as empty
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    // maxLength already stops the typing; this is only a second guard
    onSubmitComment(trimmedText.slice(0, MAX_COMMENT_LENGTH));
    setText("");
  }

  return (
    <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
      <label htmlFor="comment" className="text-sm font-medium text-muted">
        Add a comment
      </label>
      <textarea
        id="comment"
        name="comment"
        rows={3}
        required
        maxLength={MAX_COMMENT_LENGTH}
        aria-describedby={countId}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What do you see?"
        className="w-full resize-y rounded-2xl border border-field bg-white/70 p-4 backdrop-blur text-ink placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none"
      />
      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={!text.trim()}
          className="focus-ring cursor-pointer justify-self-start rounded-full bg-accent px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition duration-200 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
        >
          Send
        </button>
        <CharacterCount
          id={countId}
          count={text.length}
          max={MAX_COMMENT_LENGTH}
        />
      </div>
    </form>
  );
}
