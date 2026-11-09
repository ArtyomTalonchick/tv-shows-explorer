import { act, renderHook } from "@testing-library/react";
import type { SearchStatus, Show } from "@/SearchPage/types";
import { usePresenter } from "../usePresenter";

const show = (id: number, genres: string[]): Show => ({
  id,
  name: `Show ${id}`,
  genres,
  rating: null,
  premiered: null,
  ended: null,
  image: null,
  url: `https://www.tvmaze.com/shows/${id}`,
});

const SHOWS = [show(1, ["Drama"]), show(2, ["Drama", "Comedy"]), show(3, [])];

const render = (status: SearchStatus, shows: Show[]) =>
  renderHook(() => usePresenter({ status, query: " dark ", shows, onRetry: vi.fn(), onClear: vi.fn() }));

describe("SearchResults usePresenter", () => {
  it("counts all the shows and offers their genres", () => {
    const { result } = render("results", SHOWS);

    expect(result.current.countLabel).toBe("3 shows");
    expect(result.current.genreFilter).toMatchObject({ total: 3, selected: null });
    expect(result.current.genreFilter?.genres.map(({ genre }) => genre)).toEqual(["Drama", "Comedy"]);
  });

  it("counts the shows of the selected genre and passes only them to the list", () => {
    const { result } = render("results", SHOWS);

    act(() => result.current.genreFilter?.onSelect("Comedy"));

    expect(result.current.countLabel).toBe("1 of 3 shows · Comedy");
    expect(result.current.shows.map(({ id }) => id)).toEqual([2]);
  });

  it("hides the chips when no show has a genre", () => {
    const { result } = render("results", [show(1, [])]);

    expect(result.current.countLabel).toBe("1 show");
    expect(result.current.genreFilter).toBeNull();
  });

  it("hides the chips outside the results", () => {
    expect(render("loading", []).result.current.genreFilter).toBeNull();
    expect(render("empty", []).result.current.countLabel).toBe("0 shows");
  });
});
