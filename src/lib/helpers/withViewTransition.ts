import { flushSync } from "react-dom";

// Runs a React state update as a view transition: the browser animates from the page before the update to the
// page after it. Without the View Transitions API the update just runs.
export const withViewTransition = (update: () => void): void => {
  if (typeof document.startViewTransition !== "function") {
    update();
    return;
  }
  // flushSync makes React render the new page inside the callback, so the browser captures it.
  document.startViewTransition(() => flushSync(update));
};
