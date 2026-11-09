// Scrolls the page to the top when the start of `element` has gone above the viewport, so the user sees the
// beginning of what changed. Smooth, unless the user asks for reduced motion.
export const scrollToTopIfAbove = (element: HTMLElement | null) => {
  if (!element || element.getBoundingClientRect().top >= 0) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
};
