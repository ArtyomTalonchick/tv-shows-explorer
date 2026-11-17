import { act, renderHook } from "@testing-library/react";
import { redrawCaret } from "@/lib/screen/redrawCaret";
import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useQueryStore } from "@/SearchPage/_stores/useQueryStore";
import { useScreenStore } from "@/SearchPage/_stores/useScreenStore";
import { useScreenSwap } from "../useScreenSwap";

vi.mock("@/lib/screen/withViewTransition", () => ({
    withViewTransition: vi.fn(async (update: () => void) => update()),
}));
vi.mock("@/lib/screen/redrawCaret", () => ({ redrawCaret: vi.fn() }));

describe("useScreenSwap", () => {
    beforeEach(() => {
        useQueryStore.setState({ value: "" });
        useScreenStore.setState({ isStart: true, isSwapping: false });
        vi.mocked(withViewTransition).mockClear();
        vi.mocked(redrawCaret).mockClear();
    });

    it("opens the results screen with a transition, then shows and redraws the caret", async () => {
        const { result } = renderHook(() => useScreenSwap());
        expect(result.current.isStart).toBe(true);

        await act(async () => {
            await result.current.open();
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
            await result.current.open();
        });

        expect(result.current.isSwapping).toBe(false);
    });

    it("goes home with a transition and empties the field", async () => {
        const { result } = renderHook(() => useScreenSwap());
        await act(async () => {
            await result.current.open();
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
