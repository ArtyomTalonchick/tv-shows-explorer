import { flushSync } from "react-dom";

// Runs a React state update as a view transition: the browser animates from the page before the update to the
// page after it. Without the View Transitions API the update just runs. Resolves once the animation has finished.
export const withViewTransition = async (update: () => void): Promise<void> => {
  if (typeof document.startViewTransition !== "function") {
    update();
    return;
  }
  // flushSync makes React render the new page inside the callback, so the browser captures it.
  await document.startViewTransition(() => flushSync(update)).finished;
};
