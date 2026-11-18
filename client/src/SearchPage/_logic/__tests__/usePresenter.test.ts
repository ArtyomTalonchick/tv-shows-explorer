import { act, renderHook } from "@testing-library/react";
import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useQueryStore } from "../../_stores/useQueryStore";
import { useScreenStore } from "../../_stores/useScreenStore";
import { usePresenter } from "../usePresenter";
import { useScreenSwap } from "../useScreenSwap/useScreenSwap";
import { useSearchQuery } from "../useSearchQuery";

vi.mock("@/lib/screen/withViewTransition", () => ({
    withViewTransition: vi.fn((update: () => void) => update()),
}));

const transitionMock = vi.mocked(withViewTransition);

// The page with what its screens read from the stores: the field and the screen swap.
const renderPage = () =>
    renderHook(() => ({
        page: usePresenter(),
        query: useSearchQuery(),
        swap: useScreenSwap(),
    }));

describe("SearchPage usePresenter", () => {
    beforeEach(() => {
        useQueryStore.setState({ value: "" });
        useScreenStore.setState({ isStart: true, isSwapping: false });
        transitionMock.mockClear();
    });

    it("starts on the hero and opens the results screen, animated, when its field is focused", () => {
        const { result } = renderPage();
        expect(result.current.page.isStart).toBe(true);

        act(() => {
            void result.current.swap.open({ fromTap: false });
        });

        expect(transitionMock).toHaveBeenCalledTimes(1);
        expect(result.current.page.isStart).toBe(false);
    });

    it("stays on the results screen while typing, emptying and clearing, with no animation", () => {
        const { result } = renderPage();
        act(() => {
            void result.current.swap.open({ fromTap: false });
        });
        transitionMock.mockClear();

        act(() => result.current.query.handleChange("dark"));
        expect(result.current.page.isStart).toBe(false);

        act(() => result.current.query.handleChange(""));
        expect(result.current.page.isStart).toBe(false);

        act(() => result.current.query.handleChange("dark"));
        act(() => result.current.query.clear());
        expect(result.current.page.isStart).toBe(false);
        expect(result.current.query.value).toBe("");

        expect(transitionMock).not.toHaveBeenCalled();
    });

    it("goes back to the hero from the logo, animated, with the query reset", () => {
        const { result } = renderPage();
        act(() => {
            void result.current.swap.open({ fromTap: false });
        });
        act(() => result.current.query.handleChange("dark"));
        transitionMock.mockClear();

        act(() => {
            void result.current.swap.goHome();
        });

        expect(transitionMock).toHaveBeenCalledTimes(1);
        expect(result.current.page.isStart).toBe(true);
        expect(result.current.query.value).toBe("");
    });
});
