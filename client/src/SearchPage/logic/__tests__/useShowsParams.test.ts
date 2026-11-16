import { act, renderHook } from "@testing-library/react";
import { useShowsParams } from "../useShowsParams";

const render = (query: string) => renderHook(({ query }) => useShowsParams(query), { initialProps: { query } });

describe("useShowsParams", () => {
  it("asks nothing for an empty query", () => {
    expect(render("").result.current.params).toBeNull();
  });

  it("asks for all the genres of a query on page 1", () => {
    expect(render("dark").result.current.params).toEqual({ query: "dark", genre: null, page: 1 });
  });

  it("asks for page 1 of a chosen genre, and for all the genres again on a second click", () => {
    const { result } = render("dark");

    act(() => result.current.changePage(2));
    act(() => result.current.selectGenre("Drama"));
    expect(result.current.params).toEqual({ query: "dark", genre: "Drama", page: 1 });

    act(() => result.current.changePage(2));
    expect(result.current.params).toEqual({ query: "dark", genre: "Drama", page: 2 });

    act(() => result.current.selectGenre("Drama"));
    expect(result.current.params).toEqual({ query: "dark", genre: null, page: 1 });
  });

  it("keeps the same params object while nothing in it changes", () => {
    const { result, rerender } = render("dark");
    const params = result.current.params;

    rerender({ query: "dark" });

    expect(result.current.params).toBe(params);
  });

  it("drops the genre and the page for a new query, and does not bring them back with the old one", () => {
    const { result, rerender } = render("forest");
    act(() => result.current.selectGenre("Drama"));
    act(() => result.current.changePage(2));

    rerender({ query: "forests" });
    expect(result.current.params).toEqual({ query: "forests", genre: null, page: 1 });

    rerender({ query: "forest" });
    expect(result.current.params).toEqual({ query: "forest", genre: null, page: 1 });
  });
});
