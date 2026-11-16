import type { SystemStyleObject } from "@chakra-ui/react";

// View transitions (document.startViewTransition). An element with a view-transition-name moves to its new place
// and shows only its new look; the rest of the page fades out, and the new page fades in from slightly below.
export const viewTransitionKeyframes = {
  "page-out": { to: { opacity: 0, transform: "translateY(-1.5rem)" } },
  "page-in": { from: { opacity: 0, transform: "translateY(1.5rem)" } },
};

export const viewTransitionCss: Record<string, SystemStyleObject> = {
  "::view-transition-group(*)": {
    animationDuration: "slow",
    animationTimingFunction: "standard",
  },
  // A named element: no cross-fade, which would show its old and new text on top of each other.
  "::view-transition-old(*)": {
    animation: "none",
    opacity: 0,
  },
  "::view-transition-new(*)": {
    animation: "none",
  },
  // The page itself (after the rules above, which it overrides).
  "::view-transition-old(root)": {
    opacity: 1,
    animationName: "page-out",
    animationDuration: "slow",
    animationTimingFunction: "standard",
  },
  "::view-transition-new(root)": {
    animationName: "page-in",
    animationDuration: "slow",
    animationTimingFunction: "standard",
  },
  "::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)": {
    _motionReduce: { animation: "none" },
  },
};
