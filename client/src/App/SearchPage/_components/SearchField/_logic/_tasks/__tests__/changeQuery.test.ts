import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { changeQuery } from "../changeQuery";

const ANSWER = { query: "dark", data: null, failed: true };

describe("changeQuery", () => {
    beforeEach(() => {
        clearSearch();
    });

    it("keeps what the field holds, and leaves the search as it is", () => {
        useSearchStore.setState({ query: "dark", answer: ANSWER });

        changeQuery("dark s");

        expect(useSearchStore.getState()).toMatchObject({ value: "dark s", query: "dark", answer: ANSWER });
    });

    it("stops the search at once when the field holds nothing but spaces", () => {
        const request = new AbortController();
        useSearchStore.setState({ value: "dark", query: "dark", page: 2, request, answer: ANSWER });

        changeQuery("  ");

        expect(request.signal.aborted).toBe(true);
        expect(useSearchStore.getState()).toMatchObject({
            value: "  ",
            query: "",
            page: 1,
            request: null,
            answer: null,
        });
    });
});
