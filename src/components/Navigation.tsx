import { NavLink } from "react-router";

// NavLink adds the class "active" to the link of the current page,
// [&.active]: shows exactly that link as a colored pill
const linkClassName =
  "focus-ring rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-white/70 hover:text-ink motion-reduce:transition-none [&.active]:bg-accent [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-accent/25";

export default function Navigation() {
  return (
    <nav aria-label="Main" className="flex gap-1">
      {/* end: the link to / is only active on /, not on every page */}
      <NavLink to="/" end className={linkClassName}>
        Spotlight
      </NavLink>
      <NavLink to="/art-pieces" className={linkClassName}>
        Gallery
      </NavLink>
      <NavLink to="/favorites" className={linkClassName}>
        Favorites
      </NavLink>
    </nav>
  );
}
