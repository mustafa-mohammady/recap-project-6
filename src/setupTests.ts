import "@testing-library/jest-dom/vitest";

// jsdom cannot scroll and reports window.scrollTo as "not implemented";
// the app scrolls to the top on every new page, so it gets a no-op here
window.scrollTo = () => {};
