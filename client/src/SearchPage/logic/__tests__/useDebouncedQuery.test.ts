import { act, renderHook } from "@testing-library/react";
import { SEARCH_DEBOUNCE_MS, useDebouncedQuery } from "../useDebouncedQuery";

const render = (query: string) => renderHook(({ query }) => useDebouncedQuery(query), { initialProps: { query } });
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("useDebouncedQuery", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("passes the query once typing has stopped for the debounce", () => {
        const { result, rerender } = render("");

        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS - 1);
        expect(result.current).toBe("");

        wait(1);
        expect(result.current).toBe("dark");
    });

    it("passes an emptied field at once", () => {
        const { result, rerender } = render("dark");

        rerender({ query: "" });
        wait(0);

        expect(result.current).toBe("");
    });
});
