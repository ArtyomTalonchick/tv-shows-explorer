import type { Show, ShowsPage } from "@tv-shows-explorer/shared";
import type { SearchAnswer } from "@/stores/useSearchStore";
import { getSearchView } from "../getSearchView";

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

const pageOf = (shows: Show[], genre: string | null = null, page = 1): ShowsPage => ({
    shows,
    genres: [],
    found: shows.length,
    genre,
    total: shows.length,
    page,
    perPage: 3,
});

const found = (query: string, data: ShowsPage): SearchAnswer => ({ query, data, failed: false });
const failed = (query: string): SearchAnswer => ({ query, data: null, failed: true });

// The field holds `value`; the server was asked for `query` with no genre on page 1, and answered.
const view = (value: string, query: string, answer: SearchAnswer | null, asked: object = {}) =>
    getSearchView({ value, query, genre: null, page: 1, waiting: false, answer, ...asked });

describe("getSearchView", () => {
    it("is idle for an empty field, whatever was answered", () => {
        const dark = found("dark", pageOf([show(1, "Dark")]));

        expect(view("  ", "dark", dark)).toEqual({
            status: "idle",
            result: null,
            genre: null,
            page: 1,
            shownQuery: "",
            isLoading: false,
        });
    });

    it("is loading with nothing to show before the first answer", () => {
        expect(view(" dark", "", null)).toMatchObject({
            status: "loading",
            result: null,
            shownQuery: "dark",
            isLoading: true,
        });
        expect(view("dark", "dark", null, { waiting: true }).status).toBe("loading");
    });

    it("shows the answer to the query as it is now, with its genre and page", () => {
        const data = pageOf([show(1, "Dark")], "Drama", 2);

        expect(view("dark ", "dark", found("dark", data), { genre: "Drama", page: 2 })).toEqual({
            status: "results",
            result: data,
            genre: "Drama",
            page: 2,
            shownQuery: "dark",
            isLoading: false,
        });
    });

    it("reports an empty and a failed answer", () => {
        expect(view("qwzx", "qwzx", found("qwzx", pageOf([]))).status).toBe("empty");
        expect(view("dark", "dark", failed("dark")).status).toBe("error");
    });

    it("keeps found shows on screen, with their genre and page, while the next query waits and loads", () => {
        const forest = found("forest", pageOf([show(1, "Forest")], "Drama", 2));
        const expected = {
            status: "results",
            result: forest.data,
            genre: "Drama",
            page: 2,
            shownQuery: "forest",
            isLoading: true,
        };

        expect(view("forests", "forest", forest, { genre: "Drama", page: 2 })).toEqual(expected);
        expect(view("forests", "forests", forest, { waiting: true })).toEqual(expected);
    });

    it("marks the asked genre and page of the shown query before their answer", () => {
        const dark = found("dark", pageOf([show(1, "Dark")]));

        expect(view("dark", "dark", dark, { genre: "Crime", waiting: true })).toMatchObject({
            status: "results",
            result: dark.data,
            genre: "Crime",
            page: 1,
            isLoading: true,
        });
        expect(view("dark", "dark", dark, { page: 3, waiting: true })).toMatchObject({ genre: null, page: 3 });
    });

    it("does not keep an empty or a failed answer", () => {
        expect(view("qwz", "qwzx", found("qwzx", pageOf([]))).status).toBe("loading");
        expect(view("da", "dark", failed("dark")).status).toBe("loading");
        expect(view("dark", "dark", null, { waiting: true }).status).toBe("loading");
    });
});
