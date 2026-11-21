import { useSearchStore } from "~/stores/useSearchStore";
import { clearSearch } from "~/tasks/search/clearSearch";
import { loadShows } from "~/tasks/search/loadShows";
import { searchQuery } from "../searchQuery";

vi.mock("~/tasks/search/loadShows", () => ({ loadShows: vi.fn(async () => {}) }));

describe("searchQuery", () => {
    beforeEach(() => {
        clearSearch();
        vi.mocked(loadShows).mockClear();
    });

    it("searches for the trimmed field from all its shows on page 1", async () => {
        useSearchStore.setState({ value: " dark ", query: "dar", genre: "Drama", page: 2 });

        await searchQuery();

        expect(useSearchStore.getState()).toMatchObject({ query: "dark", genre: null, page: 1 });
        expect(loadShows).toHaveBeenCalledTimes(1);
    });

    it.each([
        ["an empty field", "  ", ""],
        ["the query already searched for", "dark ", "dark"],
    ])("asks nothing for %s", async (_, value, query) => {
        useSearchStore.setState({ value, query, genre: "Drama", answer: { query, data: null, failed: true } });

        await searchQuery();

        expect(useSearchStore.getState()).toMatchObject({ query, genre: "Drama" });
        expect(loadShows).not.toHaveBeenCalled();
    });

    it("asks again for the query already searched for when its answer was dropped while typing", async () => {
        useSearchStore.setState({ value: "dark", query: "dark", answer: null, isLoading: false });

        await searchQuery();

        expect(loadShows).toHaveBeenCalledTimes(1);
    });

    it("asks nothing for the query already on its way", async () => {
        useSearchStore.setState({ value: "dark", query: "dark", answer: null, isLoading: true });

        await searchQuery();

        expect(loadShows).not.toHaveBeenCalled();
    });
});
