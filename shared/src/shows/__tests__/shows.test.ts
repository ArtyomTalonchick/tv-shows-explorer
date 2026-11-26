import { showsPageSchema, showsQuerySchema } from "../shows";

const SHOW = {
    id: 1,
    name: "Dark",
    genres: ["Drama"],
    rating: 8.6,
    premiered: "2017-12-01",
    ended: null,
    image: null,
    url: "https://www.tvmaze.com/shows/1/dark",
};

const PAGE = {
    shows: [SHOW],
    genres: [{ genre: "Drama", count: 1 }],
    found: 1,
    genre: null,
    total: 1,
    page: 1,
    perPage: 6,
};

describe("showsQuerySchema", () => {
    it("reads the trimmed query, the genre and the page", () => {
        expect(showsQuerySchema.parse({ q: " dark ", genre: "Drama", page: "2" })).toEqual({
            query: "dark",
            genre: "Drama",
            page: 2,
        });
    });

    it("takes no genre and page 1 when they are left out or empty", () => {
        expect(showsQuerySchema.parse({ q: "dark" })).toEqual({ query: "dark", genre: null, page: 1 });
        expect(showsQuerySchema.parse({ q: "dark", genre: "" })).toEqual({ query: "dark", genre: null, page: 1 });
    });

    it("refuses a missing or blank query", () => {
        expect(showsQuerySchema.safeParse({}).success).toBe(false);
        expect(showsQuerySchema.safeParse({ q: "   " }).success).toBe(false);
    });

    it.each(["0", "-1", "1.5", "01", "two", ""])("refuses the page %j", (page) => {
        expect(showsQuerySchema.safeParse({ q: "dark", page }).success).toBe(false);
    });
});

describe("showsPageSchema", () => {
    it("takes a page of shows", () => {
        expect(showsPageSchema.parse(PAGE)).toEqual(PAGE);
    });

    it.each([
        { ...PAGE, shows: [{ ...SHOW, id: "1" }] },
        { ...PAGE, shows: [{ ...SHOW, rating: undefined }] },
        { ...PAGE, genres: null },
        { ...PAGE, total: undefined },
    ])("refuses %j", (answer) => {
        expect(showsPageSchema.safeParse(answer).success).toBe(false);
    });
});
