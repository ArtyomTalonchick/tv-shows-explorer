import type { ShowsPage } from "@tv-shows-explorer/shared";
import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "../clearSearch";
import { loadShows } from "../loadShows";
import { searchShows } from "../searchShows";

vi.mock("../searchShows", () => ({ searchShows: vi.fn() }));

const pageOf = (found: number): ShowsPage => ({
    shows: [],
    genres: [],
    found,
    genre: null,
    total: found,
    page: 1,
    perPage: 3,
});

// A request that answers when the test says so.
const deferred = () => {
    const callbacks: { resolve: (data: ShowsPage) => void; reject: (error: Error) => void } = {
        resolve: () => {},
        reject: () => {},
    };
    const promise = new Promise<ShowsPage>((resolve, reject) => {
        callbacks.resolve = resolve;
        callbacks.reject = reject;
    });
    return { promise, ...callbacks };
};

describe("loadShows", () => {
    beforeEach(() => {
        clearSearch();
        useSearchStore.setState({ value: "dark", query: "dark", genre: "Drama", page: 2 });
        vi.mocked(searchShows).mockReset();
    });

    it("asks for the query, the genre and the page of the store, and keeps the answer", async () => {
        vi.mocked(searchShows).mockResolvedValue(pageOf(4));

        await loadShows();

        expect(searchShows).toHaveBeenCalledWith({ query: "dark", genre: "Drama", page: 2 }, expect.any(AbortSignal));
        expect(useSearchStore.getState()).toMatchObject({
            request: null,
            answer: { query: "dark", data: pageOf(4), failed: false },
        });
    });

    it("keeps a failure as a failed answer, without rejecting", async () => {
        vi.mocked(searchShows).mockRejectedValue(new Error("502"));

        await loadShows();

        expect(useSearchStore.getState().answer).toEqual({ query: "dark", data: null, failed: true });
    });

    it("keeps found shows while it loads, but not an empty or a failed answer", () => {
        const pending = deferred();
        vi.mocked(searchShows).mockReturnValue(pending.promise);
        const found = { query: "dar", data: pageOf(2), failed: false };

        useSearchStore.setState({ answer: found });
        void loadShows();
        expect(useSearchStore.getState().answer).toBe(found);

        useSearchStore.setState({ answer: { query: "dar", data: pageOf(0), failed: false } });
        void loadShows();
        expect(useSearchStore.getState().answer).toBeNull();
    });

    it("cancels the request on its way, and drops its answer: the latest call wins", async () => {
        const first = deferred();
        const second = deferred();
        vi.mocked(searchShows).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

        const firstLoad = loadShows();
        const firstSignal = vi.mocked(searchShows).mock.calls[0]?.[1];
        useSearchStore.setState({ page: 3 });
        const secondLoad = loadShows();

        expect(firstSignal?.aborted).toBe(true);
        second.resolve({ ...pageOf(4), page: 3 });
        first.resolve(pageOf(4));
        await Promise.all([firstLoad, secondLoad]);

        expect(useSearchStore.getState().answer?.data?.page).toBe(3);
    });

    it("drops the answer when the search was forgotten meanwhile", async () => {
        const pending = deferred();
        vi.mocked(searchShows).mockReturnValue(pending.promise);

        const load = loadShows();
        useSearchStore.getState().forgetSearch();
        pending.resolve(pageOf(4));
        await load;

        expect(useSearchStore.getState().answer).toBeNull();
    });
    it("on keepShown, keeps the found shows on a failure, brings back their genre and page, and rejects", async () => {
        const shown = { query: "dark", data: { ...pageOf(4), genre: "Comedy", page: 1 }, failed: false };
        useSearchStore.setState({ answer: shown });
        vi.mocked(searchShows).mockRejectedValue(new Error("502"));

        await expect(loadShows({ keepShown: true })).rejects.toThrow("502");

        expect(useSearchStore.getState()).toMatchObject({ request: null, genre: "Comedy", page: 1, answer: shown });
    });

    it("on keepShown, shows a failure with Retry when no found shows are on screen", async () => {
        vi.mocked(searchShows).mockRejectedValue(new Error("502"));

        await loadShows({ keepShown: true });

        expect(useSearchStore.getState().answer).toEqual({ query: "dark", data: null, failed: true });
    });

    it("on keepShown, neither rolls back nor rejects for a request a later call cancelled", async () => {
        const first = deferred();
        const second = deferred();
        vi.mocked(searchShows).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        useSearchStore.setState({ answer: { query: "dark", data: pageOf(4), failed: false } });

        const firstLoad = loadShows({ keepShown: true });
        useSearchStore.setState({ page: 3 });
        const secondLoad = loadShows({ keepShown: true });
        first.reject(new Error("aborted"));

        await expect(firstLoad).resolves.toBeUndefined();
        expect(useSearchStore.getState().page).toBe(3);
        second.resolve({ ...pageOf(4), page: 3 });
        await secondLoad;
    });
});
