import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "../clearSearch";

describe("clearSearch", () => {
    it("empties the field, cancels the request on its way and forgets the search", () => {
        const request = new AbortController();
        useSearchStore.setState({ value: "dark", query: "dark", genre: "Drama", page: 2, request });

        clearSearch();

        expect(request.signal.aborted).toBe(true);
        expect(useSearchStore.getState()).toMatchObject({
            value: "",
            query: "",
            genre: null,
            page: 1,
            request: null,
            answer: null,
        });
    });
});
