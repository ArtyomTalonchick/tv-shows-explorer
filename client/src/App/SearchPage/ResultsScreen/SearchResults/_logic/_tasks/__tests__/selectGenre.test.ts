import { useSearchStore } from "@/stores/useSearchStore";
import { loadShows } from "@/tasks/search/loadShows";
import { selectGenre } from "../selectGenre";

vi.mock("@/tasks/search/loadShows", () => ({ loadShows: vi.fn(async () => {}) }));

describe("selectGenre", () => {
    beforeEach(() => {
        useSearchStore.setState({ query: "dark", genre: null, page: 3 });
        vi.mocked(loadShows).mockClear();
    });

    it("loads the shows of a genre from page 1", async () => {
        await selectGenre("Drama");

        expect(useSearchStore.getState()).toMatchObject({ genre: "Drama", page: 1 });
        expect(loadShows).toHaveBeenCalledTimes(1);
    });

    it("resets the filter on the selected genre again, as «All» does", async () => {
        useSearchStore.setState({ genre: "Drama" });

        await selectGenre("Drama");

        expect(useSearchStore.getState().genre).toBeNull();
        expect(loadShows).toHaveBeenCalledTimes(1);
    });
});
