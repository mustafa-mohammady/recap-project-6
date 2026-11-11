import { useEffect, useId, useState } from "react";

import { MAX_COMMENT_LENGTH } from "../artPiecesInfo";
import type { ArtPieceComment } from "../types";
import CharacterCount from "./CharacterCount";
import IconButton from "./IconButton";

type CommentItemProps = {
  comment: ArtPieceComment;
  // without it, the comment cannot be edited
  onEdit?: (text: string) => void;
  // without it, the comment cannot be deleted
  onDelete?: () => void;
};

// which button gets the focus back when the user leaves editing or deleting
type FocusTarget = "edit" | "delete" | null;

export default function CommentItem({
  comment,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const fieldId = useId();
  const countId = useId();
  const textId = useId();
  const questionId = useId();
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view");
  // what the user types; saved with every change, but only when not empty
  const [draft, setDraft] = useState(comment.text);
  // the text before editing, to get it back when the field is left empty
  const [originalText, setOriginalText] = useState(comment.text);
  const [focusTarget, setFocusTarget] = useState<FocusTarget>(null);

  function startEditing() {
    setDraft(comment.text);
    setOriginalText(comment.text);
    setMode("edit");
  }

  function backToView(target: FocusTarget) {
    setMode("view");
    setFocusTarget(target);
  }

  function finishEditing() {
    // an empty field is never saved, so deleting letter by letter has left
    // the last letter saved: the comment gets its old text back instead
    if (!draft.trim() && comment.text !== originalText) {
      onEdit?.(originalText);
    }
    backToView("edit");
  }

  // Escape cancels the delete question, wherever the focus is
  useEffect(() => {
    if (mode !== "confirmDelete") {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMode("view");
        setFocusTarget("delete");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  function handleChange(text: string) {
    setDraft(text);
    // maxLength already stops the typing; slice is only a second guard
    const trimmedText = text.trim().slice(0, MAX_COMMENT_LENGTH);
    // real time: every change is saved at once; an empty text never, and
    // the same text not again, so it is not marked "edited" for nothing
    if (onEdit && trimmedText && trimmedText !== comment.text) {
      onEdit(trimmedText);
    }
  }

  if (mode === "edit") {
    return (
      <li className="grid gap-2 rounded-2xl bg-white/50 p-4 ring-1 ring-white/70">
        <label htmlFor={fieldId} className="sr-only">
          Edit comment
        </label>
        <textarea
          id={fieldId}
          rows={3}
          maxLength={MAX_COMMENT_LENGTH}
          aria-describedby={countId}
          value={draft}
          autoFocus
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              finishEditing();
            }
          }}
          className="w-full resize-y rounded-xl border border-field bg-white/80 p-3 text-ink focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted">Saved as you type</p>
            <CharacterCount
              id={countId}
              count={draft.length}
              max={MAX_COMMENT_LENGTH}
            />
          </div>
          <IconButton
            label="Done"
            icon="confirm"
            variant="primary"
            onClick={finishEditing}
          />
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-2xl bg-white/50 p-4 ring-1 ring-white/70">
      {/* describes the buttons, so each tells which comment it acts on */}
      <p id={textId} className="whitespace-pre-line wrap-break-word">
        {comment.text}
      </p>
      <div className="mt-2 flex min-h-9 items-center justify-between gap-3">
        <p className="text-xs text-muted">
          <time dateTime={comment.date}>
            {new Date(comment.date).toLocaleString()}
          </time>
          {comment.editedDate && <span> · edited</span>}
        </p>
        {mode === "confirmDelete" && onDelete ? (
          // a second step, because a deleted comment cannot come back;
          // the keys make React build new buttons, so autoFocus works
          <div key="confirm" className="flex items-center gap-1">
            <p
              id={questionId}
              className="mr-1 text-sm font-medium text-red-700"
            >
              Delete this comment?
            </p>
            <IconButton
              label="Confirm delete"
              icon="confirm"
              variant="danger"
              describedBy={`${questionId} ${textId}`}
              onClick={onDelete}
            />
            <IconButton
              label="Cancel"
              icon="cancel"
              autoFocus
              describedBy={`${questionId} ${textId}`}
              onClick={() => backToView("delete")}
            />
          </div>
        ) : (
          <div key="actions" className="flex items-center gap-1">
            {onEdit && (
              <IconButton
                label="Edit"
                icon="edit"
                autoFocus={focusTarget === "edit"}
                describedBy={textId}
                onClick={startEditing}
              />
            )}
            {onDelete && (
              <IconButton
                label="Delete"
                icon="delete"
                autoFocus={focusTarget === "delete"}
                describedBy={textId}
                onClick={() => setMode("confirmDelete")}
              />
            )}
          </div>
        )}
      </div>
    </li>
  );
}
