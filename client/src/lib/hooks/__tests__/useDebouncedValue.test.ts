import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "../useDebouncedValue";

const render = (value: string) => renderHook(({ value }) => useDebouncedValue(value, 400), { initialProps: { value } });

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the first value at once", () => {
    const { result } = render("a");

    expect(result.current).toBe("a");
  });

  it("keeps the old value until the delay has passed", () => {
    const { result, rerender } = render("a");

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(399));
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("b");
  });

  it("takes only the last of quick changes, counting the delay from it", () => {
    const { result, rerender } = render("a");

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));
    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("c");
  });

  it("clears its timer on unmount", () => {
    const { rerender, unmount } = render("a");

    rerender({ value: "b" });
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
