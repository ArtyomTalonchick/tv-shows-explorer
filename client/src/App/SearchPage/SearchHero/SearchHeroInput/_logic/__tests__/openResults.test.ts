import { redrawCaret } from "~/lib/screen/redrawCaret";
import { waitForKeyboard } from "~/lib/screen/waitForKeyboard";
import { withViewTransition } from "~/lib/screen/withViewTransition";
import { FOCUS_KEEPER_ID } from "~/App/SearchPage/constants";
import { useScreenStore } from "~/App/SearchPage/_stores/useScreenStore";
import { openResults } from "../openResults";

vi.mock("~/lib/screen/withViewTransition", () => ({
    withViewTransition: vi.fn(async (update: () => void) => update()),
}));
vi.mock("~/lib/screen/redrawCaret", () => ({ redrawCaret: vi.fn() }));
vi.mock("~/lib/screen/waitForKeyboard", () => ({ waitForKeyboard: vi.fn(async () => {}) }));

// The invisible field the tap focuses, as `FocusKeeper` renders it.
const addKeeper = (): HTMLInputElement => {
    const keeper = document.createElement("input");
    keeper.id = FOCUS_KEEPER_ID;
    document.body.append(keeper);
    return keeper;
};

describe("openResults", () => {
    beforeEach(() => {
        useScreenStore.setState({ isStart: true, isSwapping: false });
        vi.mocked(withViewTransition).mockClear();
        vi.mocked(redrawCaret).mockClear();
        vi.mocked(waitForKeyboard).mockClear();
    });

    it("opens the results screen with a transition, then shows and redraws the caret", async () => {
        await openResults({ fromTap: false });

        expect(withViewTransition).toHaveBeenCalledTimes(1);
        expect(useScreenStore.getState()).toMatchObject({ isStart: false, isSwapping: false });
        expect(redrawCaret).toHaveBeenCalledTimes(1);
    });

    it("hides the caret while the screens swap", async () => {
        vi.mocked(withViewTransition).mockImplementationOnce(async (update: () => void) => {
            update();
            expect(useScreenStore.getState().isSwapping).toBe(true);
        });

        await openResults({ fromTap: false });

        expect(useScreenStore.getState().isSwapping).toBe(false);
    });

    it("on a tap, focuses the keeper and swaps the screens only once the keyboard is open", async () => {
        const keeper = addKeeper();
        vi.mocked(waitForKeyboard).mockImplementationOnce(async () => {
            expect(document.activeElement).toBe(keeper);
            expect(withViewTransition).not.toHaveBeenCalled();
        });

        await openResults({ fromTap: true });

        expect(waitForKeyboard).toHaveBeenCalledTimes(1);
        expect(withViewTransition).toHaveBeenCalledTimes(1);
        expect(useScreenStore.getState().isStart).toBe(false);
        keeper.remove();
    });

    it("on a click or Tab, swaps the screens at once, without the keeper", async () => {
        const keeper = addKeeper();

        await openResults({ fromTap: false });

        expect(waitForKeyboard).not.toHaveBeenCalled();
        expect(keeper).not.toHaveFocus();
        expect(withViewTransition).toHaveBeenCalledTimes(1);
        keeper.remove();
    });
});
