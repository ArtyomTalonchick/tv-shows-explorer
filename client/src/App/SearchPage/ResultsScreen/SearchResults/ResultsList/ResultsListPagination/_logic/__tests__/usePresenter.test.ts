import { renderHook, waitFor } from "@testing-library/react";
import type { ShowsPage } from "@tv-shows-explorer/shared";
import { useSearchStore } from "~/stores/useSearchStore";
import { clearSearch } from "~/tasks/search/clearSearch";
import { changePage } from "../_tasks/changePage";
import { showPageNotLoadedToast } from "../showPageNotLoadedToast";
import { usePresenter } from "../usePresenter";

vi.mock("../_tasks/changePage", () => ({ changePage: vi.fn(async () => {}) }));
vi.mock("../showPageNotLoadedToast", () => ({ showPageNotLoadedToast: vi.fn() }));

// Page 1 of the seven found shows, three on a page.
const PAGE: ShowsPage = { shows: [], genres: [], found: 7, genre: null, total: 7, page: 1, perPage: 3 };

const renderList = (state: { query: string; page: number }, data: ShowsPage = PAGE) => {
    useSearchStore.setState({ value: state.query, ...state, answer: { query: "dark", data, failed: false } });
    return renderHook(() => usePresenter()).result;
};

describe("ResultsListPagination usePresenter", () => {
    beforeEach(() => {
        clearSearch();
    });

    it("pages the shows of the shown answer, and marks the asked page at once", () => {
        const result = renderList({ query: "dark", page: 2 });

        expect(result.current.pagination).toMatchObject({ page: 2, perPage: 3, total: 7 });
    });

    it("keeps the page of the shown answer marked while a new query waits and loads", () => {
        const result = renderList({ query: "dark s", page: 1 }, { ...PAGE, page: 3 });

        expect(result.current.pagination?.page).toBe(3);
    });

    it("hides the pages when every show fits on one", () => {
        const result = renderList({ query: "dark", page: 1 }, { ...PAGE, found: 3, total: 3 });

        expect(result.current.pagination).toBeNull();
    });

    it("says so in a toast when the page fails to load", async () => {
        vi.mocked(changePage).mockRejectedValueOnce(new Error("502"));
        const result = renderList({ query: "dark", page: 1 });

        result.current.pagination?.onPageChange(2);

        await waitFor(() => expect(showPageNotLoadedToast).toHaveBeenCalledWith(2));
    });
});
