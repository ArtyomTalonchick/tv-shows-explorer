import { act, renderHook } from "@testing-library/react";
import { useSearchStore } from "@/stores/useSearchStore";
import { usePresenter } from "../usePresenter";

describe("ResultsScreen usePresenter", () => {
    beforeEach(() => {
        useSearchStore.setState({ value: "dark", query: "dark", genre: "Drama", page: 2, request: null, answer: null });
    });

    it("hands the same clear to the × of the field and to «Clear search»", () => {
        const { result } = renderHook(() => usePresenter());

        expect(result.current.results.onClear).toBe(result.current.searchBar.onClear);
    });

    it("empties the field, cancels the request on its way and gives the field the focus back", () => {
        const request = new AbortController();
        useSearchStore.setState({ request });
        const field = document.createElement("input");
        document.body.append(field);
        const { result } = renderHook(() => usePresenter());
        result.current.searchBar.fieldRef.current = field;

        act(() => result.current.results.onClear());

        expect(useSearchStore.getState()).toMatchObject({ value: "", query: "", genre: null, page: 1, request: null });
        expect(request.signal.aborted).toBe(true);
        expect(document.activeElement).toBe(field);
        field.remove();
    });
});
