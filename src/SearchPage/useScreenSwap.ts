import { useState } from "react";
import { flushSync } from "react-dom";
import { redrawCaret } from "@/lib/helpers/redrawCaret";
import { withViewTransition } from "@/lib/helpers/withViewTransition";

export type UseScreenSwapResult = {
  // The hero is shown on start and after the logo, whatever the field holds.
  isStart: boolean;
  // The screens are swapping: the caret of the results field is hidden, as iOS would draw it flying over the
  // animation.
  isSwapping: boolean;
  open: () => Promise<void>;
  goHome: () => Promise<void>;
};

// Which screen is shown, the start hero or the results screen, and the animated swap between them. Going home also
// empties the field, by the `clearQuery` it is given.
export const useScreenSwap = (clearQuery: () => void): UseScreenSwapResult => {
  const [isStart, setIsStart] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);

  const open = async (): Promise<void> => {
    await withViewTransition(() => {
      setIsSwapping(true);
      setIsStart(false);
    });
    // The caret gets its colour back before it is redrawn, not on the next render.
    flushSync(() => setIsSwapping(false));
    // The field of the results screen took the focus during the animation.
    redrawCaret();
  };

  // The results screen unmounts, so its genre and page go with it; the emptied field drops the answer.
  const goHome = async (): Promise<void> => {
    await withViewTransition(() => {
      clearQuery();
      setIsStart(true);
    });
  };

  return { isStart, isSwapping, open, goHome };
};
