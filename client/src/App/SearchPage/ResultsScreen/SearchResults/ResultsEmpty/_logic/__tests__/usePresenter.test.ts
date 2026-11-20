import { act, renderHook } from "@testing-library/react";
import { useSearchStore } from "@/stores/useSearchStore";
import { SEARCH_FIELD_ID } from "@/App/SearchPage/constants";
import { usePresenter } from "../usePresenter";

describe("ResultsEmpty usePresenter", () => {
    beforeEach(() => {
        useSearchStore.setState({
            value: "darkk",
            query: "darkk",
            genre: null,
            page: 1,
            request: null,
            isLoading: false,
            answer: { query: "darkk", data: null, failed: false },
        });
    });

    it("names the query nothing was found for", () => {
        const { result } = renderHook(() => usePresenter());

        expect(result.current.query).toBe("darkk");
    });

    it("empties the field, forgets the search and gives the field the focus back", () => {
        const field = document.createElement("input");
        field.id = SEARCH_FIELD_ID;
        document.body.append(field);
        const { result } = renderHook(() => usePresenter());

        act(() => result.current.onClear());

        expect(useSearchStore.getState()).toMatchObject({ value: "", query: "", answer: null });
        expect(document.activeElement).toBe(field);
        field.remove();
    });
});
