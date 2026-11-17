import type { RequestAnswer } from "@/lib/request/useRequest";
import { getSearchView } from "../getSearchView";
import type { Show, ShowsPage, ShowsQuery } from "@tv-shows-explorer/shared";

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

const ask = (query: string, genre: string | null = null, page = 1): ShowsQuery => ({ query, genre, page });

const pageOf = (shows: Show[], genre: string | null = null, page = 1): ShowsPage => ({
    shows,
    genres: [],
    found: shows.length,
    genre,
    total: shows.length,
    page,
    perPage: 3,
});

const found = (params: ShowsQuery, data: ShowsPage): RequestAnswer<ShowsQuery, ShowsPage> => ({
    params,
    attempt: 0,
    data,
    failed: false,
});
const failed = (params: ShowsQuery): RequestAnswer<ShowsQuery, ShowsPage> => ({
    params,
    attempt: 0,
    data: null,
    failed: true,
});

describe("getSearchView", () => {
    it("is idle for an empty query, whatever was answered", () => {
        const dark = found(ask("dark"), pageOf([show(1, "Dark")]));

        expect(getSearchView({ query: "", params: ask("dark"), current: dark, latest: dark })).toEqual({
            status: "idle",
            result: null,
            genre: null,
            page: 1,
            shownQuery: "",
            isLoading: false,
        });
    });

    it("is loading with nothing to show before the first answer", () => {
        expect(getSearchView({ query: "dark", params: ask("dar"), current: null, latest: null })).toMatchObject({
            status: "loading",
            result: null,
            shownQuery: "dark",
            isLoading: true,
        });
    });

    it("shows the answer to the query as it is now, with its genre and page", () => {
        const data = pageOf([show(1, "Dark")], "Drama", 2);
        const dark = found(ask("dark", "Drama", 2), data);

        expect(getSearchView({ query: "dark", params: dark.params, current: dark, latest: dark })).toEqual({
            status: "results",
            result: data,
            genre: "Drama",
            page: 2,
            shownQuery: "dark",
            isLoading: false,
        });
    });

    it("reports an empty and a failed answer", () => {
        const empty = found(ask("qwzx"), pageOf([]));
        const error = failed(ask("dark"));

        expect(getSearchView({ query: "qwzx", params: empty.params, current: empty, latest: empty }).status).toBe(
            "empty",
        );
        expect(getSearchView({ query: "dark", params: error.params, current: error, latest: error }).status).toBe(
            "error",
        );
    });

    it("keeps found shows on screen, with their genre and page, while the next query loads", () => {
        const forest = found(ask("forest", "Drama", 2), pageOf([show(1, "Forest")], "Drama", 2));

        expect(getSearchView({ query: "forests", params: ask("forests"), current: null, latest: forest })).toEqual({
            status: "results",
            result: forest.data,
            genre: "Drama",
            page: 2,
            shownQuery: "forest",
            isLoading: true,
        });
    });

    it("marks the asked genre and page of the shown query before their answer", () => {
        const dark = found(ask("dark"), pageOf([show(1, "Dark")]));

        expect(
            getSearchView({ query: "dark", params: ask("dark", "Crime"), current: null, latest: dark }),
        ).toMatchObject({
            status: "results",
            result: dark.data,
            genre: "Crime",
            page: 1,
            isLoading: true,
        });
        expect(
            getSearchView({ query: "dark", params: ask("dark", null, 3), current: null, latest: dark }),
        ).toMatchObject({
            genre: null,
            page: 3,
        });
    });

    it("does not keep an empty or a failed answer", () => {
        const empty = found(ask("qwzx"), pageOf([]));

        expect(getSearchView({ query: "qwz", params: ask("qwz"), current: null, latest: empty }).status).toBe(
            "loading",
        );
        expect(
            getSearchView({ query: "da", params: ask("da"), current: null, latest: failed(ask("dark")) }).status,
        ).toBe("loading");
    });
});
