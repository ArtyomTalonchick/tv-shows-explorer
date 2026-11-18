import { flushSync } from "react-dom";
import { redrawCaret } from "@/lib/screen/redrawCaret";
import { waitForKeyboard } from "@/lib/screen/waitForKeyboard";
import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useScreenStore } from "../../_stores/useScreenStore";
import { FOCUS_KEEPER_ID } from "../constants";

type OpenResultsOptions = {
    // Opened by a tap on a touch screen, which has to open the keyboard first.
    fromTap: boolean;
};

// The keyboard of iOS takes about 80 ms to open; one that does not come does not hold the swap any longer.
const KEYBOARD_TIMEOUT = 600;

// Swaps the start hero for the results screen, animated. The caret of the results field is hidden while the screens
// swap, as iOS would draw it flying over the animation.
export const openResults = async ({ fromTap }: OpenResultsOptions): Promise<void> => {
    const { setIsStart, setIsSwapping } = useScreenStore.getState();

    if (fromTap) {
        // iOS opens the keyboard a moment after the tap, and only if the field focused in the tap still has the
        // focus then. The keeper takes it inside the tap and keeps it until the keyboard is open; the results field
        // then takes the focus from it, which leaves the keyboard open.
        document.getElementById(FOCUS_KEEPER_ID)?.focus({ preventScroll: true });
        await waitForKeyboard(KEYBOARD_TIMEOUT);
    }

    await withViewTransition(() => {
        setIsSwapping(true);
        setIsStart(false);
    });
    // The caret gets its colour back before it is redrawn, not on the next render.
    flushSync(() => setIsSwapping(false));
    // The field of the results screen took the focus during the animation.
    redrawCaret();
};
