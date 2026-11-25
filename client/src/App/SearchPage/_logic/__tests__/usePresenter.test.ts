import { act, renderHook } from "@testing-library/react";
import { useScreenStore } from "../../_stores/useScreenStore";
import { usePresenter } from "../usePresenter";

describe("SearchPage usePresenter", () => {
    beforeEach(() => {
        useScreenStore.setState({ isStart: true, isSwapping: false });
    });

    it("starts on the hero, and shows the results screen once the screen store says so", () => {
        const { result } = renderHook(() => usePresenter());
        expect(result.current.isStart).toBe(true);

        act(() => useScreenStore.setState({ isStart: false }));

        expect(result.current.isStart).toBe(false);
    });
});
