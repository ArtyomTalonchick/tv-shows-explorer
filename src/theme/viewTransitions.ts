import type { SystemStyleObject } from "@chakra-ui/react";

// The transition between the start hero and the search bar (document.startViewTransition).
// The search field and the logo carry a view-transition-name and move to their new place;
// the rest of the page fades out, and the new page fades in from slightly below.
export const viewTransitionKeyframes = {
  "page-out": { to: { opacity: 0, transform: "translateY(-1.5rem)" } },
  "page-in": { from: { opacity: 0, transform: "translateY(1.5rem)" } },
};

export const viewTransitionCss: Record<string, SystemStyleObject> = {
  "::view-transition-group(*)": {
    animationDuration: "slow",
    animationTimingFunction: "standard",
  },
  "::view-transition-old(root)": {
    animationName: "page-out",
    animationDuration: "slow",
    animationTimingFunction: "standard",
  },
  "::view-transition-new(root)": {
    animationName: "page-in",
    animationDuration: "slow",
    animationTimingFunction: "standard",
  },
  // A moving element shows only its new look: a cross-fade would show the old and the new text on top of each other.
  "::view-transition-old(search-field), ::view-transition-old(logo)": {
    animation: "none",
    opacity: 0,
  },
  "::view-transition-new(search-field), ::view-transition-new(logo)": {
    animation: "none",
  },
  "::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)": {
    _motionReduce: { animation: "none" },
  },
};
