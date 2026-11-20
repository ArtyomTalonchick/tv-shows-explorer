import type { ShowsPage } from "@tv-shows-explorer/shared";
import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { changeQuery } from "../changeQuery";

const ANSWER = { query: "dark", data: null, failed: true };
const PAGE: ShowsPage = { shows: [], genres: [], found: 3, genre: null, total: 3, page: 1, perPage: 3 };
const FOUND = { query: "dark", data: PAGE, failed: false };

describe("changeQuery", () => {
    beforeEach(() => {
        clearSearch();
    });

    it("keeps what the field holds, and the found shows until the new answer", () => {
        useSearchStore.setState({ query: "dark", answer: FOUND });

        changeQuery("dark s");

        expect(useSearchStore.getState()).toMatchObject({ value: "dark s", query: "dark", answer: FOUND });
    });

    it.each([
        ["an empty answer", { query: "dark", data: { ...PAGE, found: 0 }, failed: false }],
        ["a failed answer", ANSWER],
    ])("drops %s as soon as another query is typed", (_, answer) => {
        useSearchStore.setState({ query: "dark", answer });

        changeQuery("dark s");

        expect(useSearchStore.getState()).toMatchObject({ value: "dark s", query: "dark", answer: null });
    });

    it("keeps a failed answer while the field holds its query", () => {
        useSearchStore.setState({ query: "dark", answer: ANSWER });

        changeQuery("dark ");

        expect(useSearchStore.getState().answer).toBe(ANSWER);
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
