import { act, renderHook } from "@testing-library/react";
import type { Show } from "@/SearchPage/types";
import { useGenreFilter } from "../useGenreFilter";

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

const SHOWS = [show(1, ["Drama", "Crime"]), show(2, ["Drama"]), show(3, ["Comedy"])];

const render = (shows: Show[]) => renderHook(({ shows }) => useGenreFilter(shows), { initialProps: { shows } });

describe("useGenreFilter", () => {
  it("starts with all the shows and their genres", () => {
    const { result } = render(SHOWS);

    expect(result.current.genre).toBeNull();
    expect(result.current.filteredShows).toBe(SHOWS);
    expect(result.current.genres.map(({ genre }) => genre)).toEqual(["Drama", "Comedy", "Crime"]);
  });

  it("keeps the shows of the selected genre", () => {
    const { result } = render(SHOWS);

    act(() => result.current.select("Drama"));

    expect(result.current.genre).toBe("Drama");
    expect(result.current.filteredShows.map(({ id }) => id)).toEqual([1, 2]);
  });

  it("resets by «All» and by a click on the selected genre", () => {
    const { result } = render(SHOWS);

    act(() => result.current.select("Drama"));
    act(() => result.current.select(null));
    expect(result.current.genre).toBeNull();

    act(() => result.current.select("Comedy"));
    act(() => result.current.select("Comedy"));
    expect(result.current.genre).toBeNull();
    expect(result.current.filteredShows).toBe(SHOWS);
  });

  it("keeps the filtered list the same between renders", () => {
    const { result, rerender } = render(SHOWS);

    act(() => result.current.select("Drama"));
    const filtered = result.current.filteredShows;
    rerender({ shows: SHOWS });

    expect(result.current.filteredShows).toBe(filtered);
  });

  it("shows all the shows of a new list", () => {
    const { result, rerender } = render(SHOWS);

    act(() => result.current.select("Drama"));
    const next = [show(4, ["Drama"]), show(5, ["Western"])];
    rerender({ shows: next });

    expect(result.current.genre).toBeNull();
    expect(result.current.filteredShows).toBe(next);
  });
});
