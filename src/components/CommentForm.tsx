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
    <form className="mt-6 grid gap-2" onSubmit={handleSubmit}>
      <label htmlFor="comment" className="font-semibold">
        Add a comment
      </label>
      <textarea
        id="comment"
        name="comment"
        rows={3}
        required
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="w-full rounded-xl border border-stone-300 bg-white p-3 shadow-inner focus:border-amber-500 focus:ring-2 focus:ring-amber-400/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="focus-ring cursor-pointer justify-self-start rounded-xl bg-amber-400 px-8 py-2 font-semibold text-ink shadow transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-amber-400"
      >
        Send
      </button>
    </form>
  );
}
