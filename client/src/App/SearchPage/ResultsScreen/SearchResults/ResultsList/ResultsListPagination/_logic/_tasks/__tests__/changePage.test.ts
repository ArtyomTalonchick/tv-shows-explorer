import { useSearchStore } from "~/stores/useSearchStore";
import { loadShows } from "~/tasks/search/loadShows";
import { changePage } from "../changePage";

vi.mock("~/tasks/search/loadShows", () => ({ loadShows: vi.fn(async () => {}) }));

describe("changePage", () => {
    it("loads another page of the genre", async () => {
        useSearchStore.setState({ query: "dark", genre: "Drama", page: 1 });

        await changePage(2);

        expect(useSearchStore.getState()).toMatchObject({ genre: "Drama", page: 2 });
        expect(loadShows).toHaveBeenCalledExactlyOnceWith({ keepShown: true });
    });
});
