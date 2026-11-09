import { useId } from "react";

type ColorPaletteProps = {
  colors: string[];
};

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId}>Color palette</h3>
      <ul className="palette">
        {colors.map((color) => (
          <li key={color} style={{ backgroundColor: color }} title={color}>
            {/* screen readers cannot see the circle, so they read the color */}
            <span className="visually-hidden">{color}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
