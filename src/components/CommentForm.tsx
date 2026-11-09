import { useState, type FormEvent } from "react";

type CommentFormProps = {
  onSubmitComment: (text: string) => void;
};

export default function CommentForm({ onSubmitComment }: CommentFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // a comment with only spaces counts as empty
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    onSubmitComment(trimmedText);
    setText("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label htmlFor="comment">Add a comment</label>
      <textarea
        id="comment"
        name="comment"
        rows={3}
        required
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}
