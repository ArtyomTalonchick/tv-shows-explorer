import { renderHook } from "@testing-library/react";
import type { Show, ShowsPage } from "@tv-shows-explorer/shared";
import type { SearchStatus } from "../types";
import { usePresenter } from "../usePresenter";
import { useShowsSearch, type UseShowsSearchResult } from "../useShowsSearch";

vi.mock("../useShowsSearch", () => ({ useShowsSearch: vi.fn() }));

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

// Page 1 of the three found shows, no genre chosen.
const ALL: ShowsPage = {
    shows: [show(1, ["Drama"]), show(2, ["Drama", "Comedy"]), show(3, [])],
    genres: [
        { genre: "Drama", count: 2 },
        { genre: "Comedy", count: 1 },
    ],
    found: 3,
    genre: null,
    total: 3,
    page: 1,
    perPage: 3,
};

const render = (status: SearchStatus, result: ShowsPage | null, search: Partial<UseShowsSearchResult> = {}) => {
    vi.mocked(useShowsSearch).mockReturnValue({
        status,
        shownQuery: " dark ",
        result,
        genre: result?.genre ?? null,
        page: result?.page ?? 1,
        isLoading: false,
        retry: vi.fn(),
        selectGenre: vi.fn(),
        changePage: vi.fn(),
        ...search,
    });
    return renderHook(() => usePresenter());
};

describe("SearchResults usePresenter", () => {
    it("counts all the shows, offers their genres and passes the page on to the list", () => {
        const { result } = render("results", ALL);

        expect(result.current.head).toEqual({ query: "dark", count: "3 shows" });
        expect(result.current.genreFilter).toMatchObject({ genres: ALL.genres, total: 3, selected: null });
        expect(result.current.list).toMatchObject({ shows: ALL.shows, page: 1, perPage: 3, total: 3 });
        expect(result.current.isBusy).toBe(false);
    });

    it("counts the shows of the answered genre out of all the found ones", () => {
        const comedy: ShowsPage = { ...ALL, shows: [ALL.shows[1]!], genre: "Comedy", total: 1 };
        const { result } = render("results", comedy);

        expect(result.current.head?.count).toBe("1 of 3 shows · Comedy");
        expect(result.current.list).toMatchObject({ total: 1 });
    });

    it("marks the asked genre and page at once, and is busy until their answer", () => {
        const { result } = render("results", ALL, { genre: "Comedy", page: 2, isLoading: true });

        expect(result.current.genreFilter?.selected).toBe("Comedy");
        expect(result.current.list?.page).toBe(2);
        expect(result.current.head?.count).toBe("3 shows");
        expect(result.current.isBusy).toBe(true);
    });

    it("hides the chips when no show has a genre", () => {
        const { result } = render("results", { ...ALL, shows: [show(1, [])], genres: [], found: 1, total: 1 });

        expect(result.current.head?.count).toBe("1 show");
        expect(result.current.genreFilter).toBeNull();
    });

    it("shows no chips and no list outside the results", () => {
        const loading = render("loading", null, { isLoading: true }).result.current;
        expect(loading).toMatchObject({ genreFilter: null, list: null, isBusy: false, isLoading: true });
        const empty = render("empty", null).result.current;
        expect(empty.head?.count).toBe("0 shows");
        expect(empty.empty).toEqual({ query: "dark" });
        expect(render("error", null).result.current.error).toMatchObject({ onRetry: expect.any(Function) });
    });

    it("shows only the idle message for an empty field, with no heading", () => {
        const { result } = render("idle", null);

        expect(result.current.isIdle).toBe(true);
        expect(result.current.head).toBeNull();
        expect(result.current.genreFilter).toBeNull();
    });
});
