import { act, renderHook } from "@testing-library/react";
import { useRequest } from "../useRequest";

const request = vi.fn<(params: string, signal: AbortSignal) => Promise<number>>();

// A request the test answers by hand.
const deferred = () => {
  let resolve!: (value: number) => void;
  const promise = new Promise<number>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

const render = (params: string | null) =>
  renderHook(({ params }) => useRequest(request, params), { initialProps: { params } });
const flush = () => act(async () => {});
const signalOf = (call: number) => request.mock.calls[call]![1];

describe("useRequest", () => {
  beforeEach(() => {
    request.mockReset();
  });

  it("sends nothing for null params", () => {
    const { result } = render(null);

    expect(request).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ latest: null, current: null });
  });

  it("answers with the data for the params", async () => {
    request.mockResolvedValue(42);
    const { result } = render("a");
    await flush();

    expect(request).toHaveBeenCalledWith("a", expect.any(AbortSignal));
    expect(result.current.current).toEqual({ params: "a", attempt: 0, data: 42, failed: false });
    expect(result.current.latest).toBe(result.current.current);
  });

  it("cancels the previous request and drops its late answer", async () => {
    const first = deferred();
    const second = deferred();
    request.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const { result, rerender } = render("a");

    rerender({ params: "b" });
    expect(signalOf(0).aborted).toBe(true);
    expect(signalOf(1).aborted).toBe(false);

    second.resolve(2);
    await flush();
    first.resolve(1);
    await flush();

    expect(result.current.latest).toEqual({ params: "b", attempt: 0, data: 2, failed: false });
  });

  it("keeps the last answer while the next params load", async () => {
    request.mockResolvedValueOnce(1).mockReturnValueOnce(new Promise(() => {}));
    const { result, rerender } = render("a");
    await flush();

    rerender({ params: "b" });

    expect(result.current.current).toBeNull();
    expect(result.current.latest).toEqual({ params: "a", attempt: 0, data: 1, failed: false });
  });

  it("reports a failure, and Retry sends the same params again", async () => {
    request.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(7);
    const { result } = render("a");
    await flush();
    expect(result.current.current).toEqual({ params: "a", attempt: 0, data: null, failed: true });

    act(() => result.current.retry());
    expect(result.current.current).toBeNull();
    await flush();

    expect(request).toHaveBeenLastCalledWith("a", expect.any(AbortSignal));
    expect(result.current.current).toEqual({ params: "a", attempt: 1, data: 7, failed: false });
  });

  it("forgets the last answer on reset", async () => {
    request.mockResolvedValue(1);
    const { result } = render("a");
    await flush();

    act(() => result.current.reset());

    expect(result.current).toMatchObject({ latest: null, current: null });
  });

  it("cancels the request on unmount", () => {
    request.mockReturnValue(new Promise(() => {}));
    const { unmount } = render("a");

    unmount();

    expect(signalOf(0).aborted).toBe(true);
  });
});
