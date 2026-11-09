import { NavLink } from "react-router";

// NavLink adds the class "active" to the link of the current page,
// [&.active]: styles exactly that link
const linkClassName =
  "focus-ring py-4 text-center font-medium text-stone-700 transition-colors hover:bg-stone-300 [&.active]:bg-stone-600 [&.active]:text-white";

export default function Navigation() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 grid grid-cols-3 border-t border-stone-300 bg-stone-200 pb-[env(safe-area-inset-bottom)]"
    >
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
