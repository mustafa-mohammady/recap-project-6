import { NavLink } from "react-router";

export default function Navigation() {
  return (
    <nav aria-label="Main">
      {/* end: the link to / is only active on /, not on every page */}
      <NavLink to="/" end>
        Spotlight
      </NavLink>
      <NavLink to="/art-pieces">Gallery</NavLink>
    </nav>
  );
}
