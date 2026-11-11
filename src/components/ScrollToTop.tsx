import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

// The router keeps the scroll position when another page opens, so a
// details page opened from far down the gallery would start scrolled down.
// This scrolls to the top on every new page, but not when only the search
// of the same page changes (typing in the gallery filters), and not on
// Back or Forward, where the browser brings back the old position.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const isNewPage = pathname !== previousPathname.current;
    previousPathname.current = pathname;
    // POP: Back or Forward
    if (isNewPage && navigationType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
}
