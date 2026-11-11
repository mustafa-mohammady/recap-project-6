type CharacterCountProps = {
  // for aria-describedby of the text field
  id: string;
  count: number;
  max: number;
};

// "42/150" under a text field; red when the limit is reached
export default function CharacterCount({
  id,
  count,
  max,
}: CharacterCountProps) {
  const isFull = count >= max;

  return (
    <p
      id={id}
      className={`text-xs tabular-nums ${isFull ? "font-semibold text-red-700" : "text-muted"}`}
    >
      {/* screen readers hear only the limit, not every new number */}
      <span aria-hidden="true">
        {count}/{max}
      </span>
      <span className="sr-only">{max} characters at most</span>
    </p>
  );
}
