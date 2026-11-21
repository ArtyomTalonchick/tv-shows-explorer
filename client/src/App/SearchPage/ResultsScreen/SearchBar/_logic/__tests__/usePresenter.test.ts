import { act, renderHook } from "@testing-library/react";
import { withViewTransition } from "~/lib/screen/withViewTransition";
import { useScreenStore } from "~/App/SearchPage/_stores/useScreenStore";
import { useSearchStore } from "~/stores/useSearchStore";
import { usePresenter } from "../usePresenter";

vi.mock("~/lib/screen/withViewTransition", () => ({
    withViewTransition: vi.fn(async (update: () => void) => update()),
}));

describe("SearchBar usePresenter", () => {
    it("goes back to the hero with a transition, clearing the search inside it", async () => {
        useScreenStore.setState({ isStart: false });
        useSearchStore.setState({ value: "dark" });
        vi.mocked(withViewTransition).mockImplementationOnce(async (update) => {
            expect(useScreenStore.getState().isStart).toBe(false);
            update();
        });
        const { result } = renderHook(() => usePresenter());

        await act(async () => result.current.onHome());

        expect(withViewTransition).toHaveBeenCalledTimes(1);
        expect(useSearchStore.getState().value).toBe("");
        expect(useScreenStore.getState().isStart).toBe(true);
    });
});
