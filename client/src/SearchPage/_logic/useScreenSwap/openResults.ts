import { flushSync } from "react-dom";
import { redrawCaret } from "@/lib/screen/redrawCaret";
import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useScreenStore } from "../../_stores/useScreenStore";

// Swaps the start hero for the results screen, animated. The caret of the results field is hidden while the screens
// swap, as iOS would draw it flying over the animation.
export const openResults = async (): Promise<void> => {
    const { setIsStart, setIsSwapping } = useScreenStore.getState();

    await withViewTransition(() => {
        setIsSwapping(true);
        setIsStart(false);
    });
    // The caret gets its colour back before it is redrawn, not on the next render.
    flushSync(() => setIsSwapping(false));
    // The field of the results screen took the focus during the animation.
    redrawCaret();
};
