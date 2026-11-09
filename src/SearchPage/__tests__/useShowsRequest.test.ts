import { act, renderHook } from "@testing-library/react";
import { searchShows } from "../searchShows";
import type { Show } from "../types";
import { SEARCH_DEBOUNCE_MS, useShowsRequest } from "../useShowsRequest";

vi.mock("../searchShows", () => ({ searchShows: vi.fn() }));

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

// A request the test answers by hand.
const deferred = () => {
  let resolve!: (shows: Show[]) => void;
  const promise = new Promise<Show[]>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

const render = () => renderHook(({ query }) => useShowsRequest(query), { initialProps: { query: "" } });
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
    searchMock.mockResolvedValue([show(1, "Dark")]);
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
    expect(searchMock).toHaveBeenCalledWith("dark", expect.any(AbortSignal));
    expect(result.current).toMatchObject({ status: "results", shows: [show(1, "Dark")] });
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

    second.resolve([show(2, "Darkroom")]);
    await flush();
    first.resolve([show(1, "Dark")]);
    await flush();

    expect(result.current).toMatchObject({ status: "results", shows: [show(2, "Darkroom")] });
  });

  it("reports no results when TVmaze finds nothing", async () => {
    searchMock.mockResolvedValue([]);
    const { result, rerender } = render();

    rerender({ query: "qwzx" });
    wait(SEARCH_DEBOUNCE_MS);
    await flush();

    expect(result.current.status).toBe("empty");
  });

  it("reports an error, and Retry sends the same query again", async () => {
    const retried = deferred();
    searchMock.mockRejectedValueOnce(new Error("offline")).mockReturnValueOnce(retried.promise);
    const { result, rerender } = render();

    rerender({ query: "dark" });
    wait(SEARCH_DEBOUNCE_MS);
    await flush();
    expect(result.current.status).toBe("error");

    act(() => result.current.retry());
    expect(result.current.status).toBe("loading");
    retried.resolve([show(1, "Dark")]);
    await flush();

    expect(searchMock.mock.calls[1]?.[0]).toBe("dark");
    expect(result.current.status).toBe("results");
  });

  it("drops the results at once when the query becomes empty", async () => {
    searchMock.mockResolvedValue([show(1, "Dark")]);
    const { result, rerender } = render();
    rerender({ query: "dark" });
    wait(SEARCH_DEBOUNCE_MS);
    await flush();

    rerender({ query: "" });

    expect(result.current).toMatchObject({ status: "idle", shows: [] });
    wait(SEARCH_DEBOUNCE_MS);
    expect(searchMock).toHaveBeenCalledTimes(1);
  });
});
