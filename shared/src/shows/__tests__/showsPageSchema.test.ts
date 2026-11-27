import { showsPageSchema } from "../showsPageSchema";

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
