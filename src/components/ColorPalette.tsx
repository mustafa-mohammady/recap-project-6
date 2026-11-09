import { useId } from "react";

type ColorPaletteProps = {
  colors: string[];
};

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="mt-6">
      <h3
        id={headingId}
        className="text-sm font-semibold tracking-wide text-stone-500 uppercase"
      >
        Color palette
      </h3>
      <ul className="mt-2 flex flex-wrap gap-3">
        {colors.map((color) => (
          <li
            key={color}
            // the color comes from the API, so it is set as an inline style
            style={{ backgroundColor: color }}
            title={color}
            className="size-10 rounded-full border border-black/15 shadow-sm"
          >
            {/* screen readers cannot see the circle, so they read the color */}
            <span className="sr-only">{color}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
