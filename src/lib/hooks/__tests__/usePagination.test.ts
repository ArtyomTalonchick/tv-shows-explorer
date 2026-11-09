import { act, renderHook } from "@testing-library/react";
import { usePagination } from "../usePagination";

const TEN = Array.from({ length: 10 }, (_, index) => index + 1);

const render = (items: number[]) => renderHook(({ items }) => usePagination(items, 3), { initialProps: { items } });

describe("usePagination", () => {
  it("starts on page 1 with the first items", () => {
    const { result } = render(TEN);

    expect(result.current.page).toBe(1);
    expect(result.current.pageCount).toBe(4);
    expect(result.current.pageItems).toEqual([1, 2, 3]);
  });

  it("goes to any page, the last one holding the rest", () => {
    const { result } = render(TEN);

    act(() => result.current.setPage(2));
    expect(result.current.pageItems).toEqual([4, 5, 6]);

    act(() => result.current.setPage(4));
    expect(result.current.pageItems).toEqual([10]);
  });

  it("keeps the page within 1…pageCount", () => {
    const { result } = render(TEN);

    act(() => result.current.setPage(9));
    expect(result.current.page).toBe(4);

    act(() => result.current.setPage(0));
    expect(result.current.page).toBe(1);
  });

  it("keeps the page while the list stays the same", () => {
    const { result, rerender } = render(TEN);

    act(() => result.current.setPage(3));
    rerender({ items: TEN });

    expect(result.current.page).toBe(3);
  });

  it("opens page 1 for a new list", () => {
    const { result, rerender } = render(TEN);

    act(() => result.current.setPage(3));
    rerender({ items: [...TEN] });

    expect(result.current.page).toBe(1);
    expect(result.current.pageItems).toEqual([1, 2, 3]);
  });

  it("has one empty page for an empty list", () => {
    const { result } = render([]);

    expect(result.current.pageCount).toBe(1);
    expect(result.current.pageItems).toEqual([]);
  });
});
