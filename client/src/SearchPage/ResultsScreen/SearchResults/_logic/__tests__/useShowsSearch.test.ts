import { act, renderHook } from "@testing-library/react";
import { useQueryStore } from "@/SearchPage/_stores/useQueryStore";
import { searchShows } from "../tasks/searchShows";
import { useShowsSearch } from "../useShowsSearch";

vi.mock("../tasks/searchShows", () => ({ searchShows: vi.fn() }));

describe("useShowsSearch", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useQueryStore.setState({ value: "" });
        vi.mocked(searchShows).mockReturnValue(new Promise(() => {}));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows the idle message for an empty field", () => {
        const { result } = renderHook(() => useShowsSearch());

        expect(result.current.status).toBe("idle");
    });

    it("loads the query typed in the field, and is idle again once the field is emptied", () => {
        const { result } = renderHook(() => useShowsSearch());

        act(() => useQueryStore.getState().setValue("dark"));
        expect(result.current.status).toBe("loading");

        act(() => useQueryStore.getState().setValue(""));
        expect(result.current.status).toBe("idle");
    });

    it("is idle after the field is cleared, as the logo and «Clear search» do", () => {
        const { result } = renderHook(() => useShowsSearch());
        act(() => useQueryStore.getState().setValue("dark"));

        act(() => useQueryStore.getState().clear());

        expect(result.current.status).toBe("idle");
    });
});
