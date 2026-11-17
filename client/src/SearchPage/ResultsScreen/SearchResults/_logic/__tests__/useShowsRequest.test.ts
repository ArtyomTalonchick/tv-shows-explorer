import { act, renderHook } from "@testing-library/react";
import type { Show, ShowsPage } from "@tv-shows-explorer/shared";
import { searchShows } from "../tasks/searchShows";
import { SEARCH_DEBOUNCE_MS, useDebouncedQuery } from "../useDebouncedQuery";
import { useShowsParams } from "../useShowsParams";
import { useShowsRequest } from "../useShowsRequest";

vi.mock("../tasks/searchShows", () => ({ searchShows: vi.fn() }));

const searchMock = vi.mocked(searchShows);

const show = (id: number, name: string): Show => ({
    id,
    name,
    genres: [],
    rating: null,
    premiered: null,
    ended: null,
    image: null,
    url: `https://www.tvmaze.com/shows/${id}`,
});

const pageOf = (shows: Show[], genre: string | null = null): ShowsPage => ({
    shows,
    genres: [],
    found: shows.length,
    genre,
    total: shows.length,
    page: 1,
    perPage: 3,
});

const ask = (query: string, genre: string | null = null, page = 1) => ({ query, genre, page });

// A request the test answers by hand.
const deferred = () => {
    let resolve!: (page: ShowsPage) => void;
    const promise = new Promise<ShowsPage>((res) => {
        resolve = res;
    });
    return { promise, resolve };
};

// The request as the Presenter joins it: the query once typing stops, what to ask, then the request for it.
const useSearch = (query: string) => {
    const { params, selectGenre, changePage } = useShowsParams(useDebouncedQuery(query));
    return { ...useShowsRequest(query, params), selectGenre, changePage };
};

const render = () => renderHook(({ query }) => useSearch(query), { initialProps: { query: "" } });
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));
const flush = () => act(async () => {});
const signalOf = (call: number) => searchMock.mock.calls[call]![1];

describe("useShowsRequest", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        searchMock.mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("is idle and sends nothing for an empty query", () => {
        const { result } = render();
        wait(SEARCH_DEBOUNCE_MS);

        expect(result.current.status).toBe("idle");
        expect(searchMock).not.toHaveBeenCalled();
    });

    it("sends one request once the query stops changing", async () => {
        const dark = pageOf([show(1, "Dark")]);
        searchMock.mockResolvedValue(dark);
        const { result, rerender } = render();

        rerender({ query: "d" });
        wait(SEARCH_DEBOUNCE_MS - 100);
        rerender({ query: "da" });
        wait(SEARCH_DEBOUNCE_MS - 100);
        rerender({ query: "dark" });
        expect(result.current.status).toBe("loading");
        expect(searchMock).not.toHaveBeenCalled();

        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        expect(searchMock).toHaveBeenCalledTimes(1);
        expect(searchMock).toHaveBeenCalledWith(ask("dark"), expect.any(AbortSignal));
        expect(result.current).toMatchObject({ status: "results", result: dark });
    });

    it("cancels the previous request and never shows its late answer", async () => {
        const first = deferred();
        const second = deferred();
        searchMock.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const { result, rerender } = render();

        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS);
        rerender({ query: "darkroom" });
        wait(SEARCH_DEBOUNCE_MS);
        expect(signalOf(0).aborted).toBe(true);
        expect(signalOf(1).aborted).toBe(false);

        const darkroom = pageOf([show(2, "Darkroom")]);
        second.resolve(darkroom);
        await flush();
        first.resolve(pageOf([show(1, "Dark")]));
        await flush();

        expect(result.current).toMatchObject({ status: "results", result: darkroom });
    });

    it("reports no results when nothing is found", async () => {
        searchMock.mockResolvedValue(pageOf([]));
        const { result, rerender } = render();

        rerender({ query: "qwzx" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        expect(result.current.status).toBe("empty");
    });

    it("reports an error, and Retry sends the same request again", async () => {
        const retried = deferred();
        searchMock.mockRejectedValueOnce(new Error("offline")).mockReturnValueOnce(retried.promise);
        const { result, rerender } = render();

        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();
        expect(result.current.status).toBe("error");

        act(() => result.current.retry());
        expect(result.current.status).toBe("loading");
        retried.resolve(pageOf([show(1, "Dark")]));
        await flush();

        expect(searchMock.mock.calls[1]?.[0]).toEqual(ask("dark"));
        expect(result.current.status).toBe("results");
    });

    it("asks for another genre at once, keeping the shown results until its answer", async () => {
        const all = pageOf([show(1, "Dark"), show(2, "Dark Matter")]);
        const drama = deferred();
        searchMock.mockResolvedValueOnce(all).mockReturnValueOnce(drama.promise);
        const { result, rerender } = render();
        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        act(() => result.current.selectGenre("Drama"));
        await flush();

        expect(searchMock).toHaveBeenLastCalledWith(ask("dark", "Drama"), expect.any(AbortSignal));
        expect(result.current).toMatchObject({ status: "results", result: all, genre: "Drama", isLoading: true });

        const dramas = pageOf([show(1, "Dark")], "Drama");
        drama.resolve(dramas);
        await flush();
        expect(result.current).toMatchObject({ status: "results", result: dramas, genre: "Drama", isLoading: false });
    });

    it("drops the results at once when the query becomes empty", async () => {
        searchMock.mockResolvedValue(pageOf([show(1, "Dark")]));
        const { result, rerender } = render();
        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        rerender({ query: "" });

        expect(result.current).toMatchObject({ status: "idle", result: null });
        wait(SEARCH_DEBOUNCE_MS);
        expect(searchMock).toHaveBeenCalledTimes(1);
    });

    it("keeps the shown results while the next query waits and loads", async () => {
        const next = deferred();
        const forest = pageOf([show(1, "Forest")]);
        searchMock.mockResolvedValueOnce(forest).mockReturnValueOnce(next.promise);
        const { result, rerender } = render();
        rerender({ query: "forest" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        rerender({ query: "forests" });
        expect(result.current).toMatchObject({ status: "results", shownQuery: "forest", isLoading: true });
        expect(result.current.result).toBe(forest);

        wait(SEARCH_DEBOUNCE_MS);
        expect(result.current).toMatchObject({ status: "results", shownQuery: "forest", isLoading: true });
        expect(result.current.result).toBe(forest);

        const forests = pageOf([show(2, "Forests")]);
        next.resolve(forests);
        await flush();
        expect(result.current).toMatchObject({
            status: "results",
            result: forests,
            shownQuery: "forests",
            isLoading: false,
        });
    });

    it("changes nothing when the query is typed back within the debounce", async () => {
        const forest = pageOf([show(1, "Forest")]);
        searchMock.mockResolvedValue(forest);
        const { result, rerender } = render();
        rerender({ query: "forest" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        rerender({ query: "fores" });
        wait(SEARCH_DEBOUNCE_MS - 100);
        rerender({ query: "forest" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        expect(searchMock).toHaveBeenCalledTimes(1);
        expect(result.current).toMatchObject({ status: "results", shownQuery: "forest", isLoading: false });
        expect(result.current.result).toBe(forest);
    });

    it("loads with skeletons after an empty or failed answer", async () => {
        searchMock.mockResolvedValueOnce(pageOf([])).mockRejectedValueOnce(new Error("offline"));
        const { result, rerender } = render();
        rerender({ query: "qwzx" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        rerender({ query: "qwz" });
        expect(result.current).toMatchObject({ status: "loading", shownQuery: "qwz", isLoading: true });

        wait(SEARCH_DEBOUNCE_MS);
        await flush();
        expect(result.current.status).toBe("error");

        rerender({ query: "qw" });
        expect(result.current).toMatchObject({ status: "loading", shownQuery: "qw", isLoading: true });
    });

    it("loads with skeletons after the field was emptied", async () => {
        searchMock.mockResolvedValueOnce(pageOf([show(1, "Dark")])).mockReturnValueOnce(new Promise(() => {}));
        const { result, rerender } = render();
        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        rerender({ query: "" });
        rerender({ query: "lost" });

        expect(result.current).toMatchObject({ status: "loading", result: null, shownQuery: "lost", isLoading: true });
    });

    it("sends the query again when it is typed back within the debounce after the field was emptied", async () => {
        const dark = pageOf([show(1, "Dark")]);
        searchMock.mockResolvedValue(dark);
        const { result, rerender } = render();
        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        rerender({ query: "" });
        wait(100);
        rerender({ query: "dark" });
        expect(result.current).toMatchObject({ status: "loading", isLoading: true });

        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        expect(searchMock).toHaveBeenCalledTimes(2);
        expect(result.current).toMatchObject({ status: "results", result: dark, isLoading: false });
    });

    it("does not send the old query when another one is typed within the debounce after the field was emptied", async () => {
        searchMock.mockResolvedValueOnce(pageOf([show(1, "Dark")])).mockReturnValueOnce(new Promise(() => {}));
        const { result, rerender } = render();
        rerender({ query: "dark" });
        wait(SEARCH_DEBOUNCE_MS);
        await flush();

        rerender({ query: "" });
        wait(100);
        rerender({ query: "d" });
        await flush();

        expect(searchMock).toHaveBeenCalledTimes(1);
        expect(result.current).toMatchObject({ status: "loading", result: null, shownQuery: "d" });

        wait(SEARCH_DEBOUNCE_MS);
        expect(searchMock).toHaveBeenLastCalledWith(ask("d"), expect.any(AbortSignal));
    });
});
