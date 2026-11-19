import { act, renderHook } from "@testing-library/react";
import { redrawCaret } from "@/lib/screen/redrawCaret";
import { waitForKeyboard } from "@/lib/screen/waitForKeyboard";
import { withViewTransition } from "@/lib/screen/withViewTransition";
import { FOCUS_KEEPER_ID } from "@/App/SearchPage/constants";
import { useQueryStore } from "@/App/SearchPage/_stores/useQueryStore";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { useScreenSwap } from "../useScreenSwap";

vi.mock("@/lib/screen/withViewTransition", () => ({
    withViewTransition: vi.fn(async (update: () => void) => update()),
}));
vi.mock("@/lib/screen/redrawCaret", () => ({ redrawCaret: vi.fn() }));
vi.mock("@/lib/screen/waitForKeyboard", () => ({ waitForKeyboard: vi.fn(async () => {}) }));

describe("useScreenSwap", () => {
    beforeEach(() => {
        useQueryStore.setState({ value: "" });
        useScreenStore.setState({ isStart: true, isSwapping: false });
        vi.mocked(withViewTransition).mockClear();
        vi.mocked(redrawCaret).mockClear();
        vi.mocked(waitForKeyboard).mockClear();
    });

    it("opens the results screen with a transition, then shows and redraws the caret", async () => {
        const { result } = renderHook(() => useScreenSwap());
        expect(result.current.isStart).toBe(true);

        await act(async () => {
            await result.current.open({ fromTap: false });
        });

        expect(withViewTransition).toHaveBeenCalledTimes(1);
        expect(result.current).toMatchObject({ isStart: false, isSwapping: false });
        expect(redrawCaret).toHaveBeenCalledTimes(1);
    });

    it("hides the caret while the screens swap", async () => {
        vi.mocked(withViewTransition).mockImplementationOnce(async (update: () => void) => {
            update();
            expect(useScreenStore.getState().isSwapping).toBe(true);
        });
        const { result } = renderHook(() => useScreenSwap());

        await act(async () => {
            await result.current.open({ fromTap: false });
        });

        expect(result.current.isSwapping).toBe(false);
    });

    it("on a tap, focuses the keeper and swaps the screens only once the keyboard is open", async () => {
        const keeper = document.createElement("input");
        keeper.id = FOCUS_KEEPER_ID;
        document.body.append(keeper);
        vi.mocked(waitForKeyboard).mockImplementationOnce(async () => {
            expect(document.activeElement).toBe(keeper);
            expect(withViewTransition).not.toHaveBeenCalled();
        });
        const { result } = renderHook(() => useScreenSwap());

        await act(async () => {
            await result.current.open({ fromTap: true });
        });

        expect(waitForKeyboard).toHaveBeenCalledTimes(1);
        expect(withViewTransition).toHaveBeenCalledTimes(1);
        expect(result.current.isStart).toBe(false);
        keeper.remove();
    });

    it("on a click or Tab, swaps the screens at once, without the keeper", async () => {
        const keeper = document.createElement("input");
        keeper.id = FOCUS_KEEPER_ID;
        document.body.append(keeper);
        const { result } = renderHook(() => useScreenSwap());

        await act(async () => {
            await result.current.open({ fromTap: false });
        });

        expect(waitForKeyboard).not.toHaveBeenCalled();
        expect(keeper).not.toHaveFocus();
        expect(withViewTransition).toHaveBeenCalledTimes(1);
        keeper.remove();
    });

    it("goes home with a transition and empties the field", async () => {
        const { result } = renderHook(() => useScreenSwap());
        await act(async () => {
            await result.current.open({ fromTap: false });
        });
        act(() => useQueryStore.getState().setValue("dark"));

        await act(async () => {
            await result.current.goHome();
        });

        expect(withViewTransition).toHaveBeenCalledTimes(2);
        expect(useQueryStore.getState().value).toBe("");
        expect(result.current.isStart).toBe(true);
    });
});
