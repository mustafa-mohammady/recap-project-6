import { useId } from "react";

type ColorPaletteProps = {
  colors: string[];
};

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="mt-8">
      <h3 id={headingId} className="text-sm font-medium text-muted">
        Color palette
      </h3>
      <ul className="mt-3 flex flex-wrap gap-3">
        {colors.map((color) => (
          <li
            key={color}
            // the color comes from the API, so it is set as an inline style
            style={{ backgroundColor: color }}
            title={color}
            className="size-10 rounded-full shadow-sm ring-1 ring-black/10 ring-offset-2 ring-offset-surface transition-transform hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            {/* screen readers cannot see the circle, so they read the color */}
            <span className="sr-only">{color}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
