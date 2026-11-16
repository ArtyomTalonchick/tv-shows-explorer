import type { Show } from "@tv-shows-explorer/shared";
import { getShowsPage } from "../getShowsPage";

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

// Five dramas, two comedies among them, and one show with no genre.
const FOUND = [
    show(1, ["Drama"]),
    show(2, ["Drama", "Comedy"]),
    show(3, []),
    show(4, ["Drama"]),
    show(5, ["Drama", "Comedy"]),
    show(6, ["Drama"]),
];

const ids = (shows: Show[]): number[] => shows.map(({ id }) => id);

describe("getShowsPage", () => {
    it("gives the first three of all the shows and the genres of all of them", () => {
        expect(getShowsPage(FOUND, { genre: null, page: 1 })).toEqual({
            shows: FOUND.slice(0, 3),
            genres: [
                { genre: "Drama", count: 5 },
                { genre: "Comedy", count: 2 },
            ],
            found: 6,
            genre: null,
            total: 6,
            page: 1,
            perPage: 3,
        });
    });

    it("pages the shows of the genre and counts them, with the genres of all the found shows", () => {
        const page = getShowsPage(FOUND, { genre: "Drama", page: 2 });

        expect(ids(page.shows)).toEqual([5, 6]);
        expect(page).toMatchObject({ found: 6, genre: "Drama", total: 5, page: 2 });
        expect(page.genres).toHaveLength(2);
    });

    it("gives the last page for a page past it", () => {
        const page = getShowsPage(FOUND, { genre: "Comedy", page: 3 });

        expect(ids(page.shows)).toEqual([2, 5]);
        expect(page.page).toBe(1);
    });

    it("gives an empty page 1 for a genre no show has, and for no shows", () => {
        expect(getShowsPage(FOUND, { genre: "Western", page: 2 })).toMatchObject({ shows: [], total: 0, page: 1 });
        expect(getShowsPage([], { genre: null, page: 1 })).toMatchObject({ shows: [], genres: [], found: 0, page: 1 });
    });
});
