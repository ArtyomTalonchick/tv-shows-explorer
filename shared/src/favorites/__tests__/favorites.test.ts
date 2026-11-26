import { addFavoriteBodySchema, favoriteParamsSchema, favoriteSchema } from "../favorites";

const FAVORITE = {
    id: 1,
    name: "Dark",
    genres: ["Drama"],
    premiered: "2017-12-01",
    ended: null,
    image: null,
    url: "https://www.tvmaze.com/shows/1/dark",
    addedAt: 1_700_000_000_000,
};

describe("favoriteSchema", () => {
    it("takes a favorite", () => {
        expect(favoriteSchema.parse(FAVORITE)).toEqual(FAVORITE);
    });

    it.each([
        { ...FAVORITE, addedAt: undefined },
        { ...FAVORITE, name: null },
    ])("refuses %j", (answer) => {
        expect(favoriteSchema.safeParse(answer).success).toBe(false);
    });
});

describe("favoriteParamsSchema", () => {
    it("reads a whole number from 1", () => {
        expect(favoriteParamsSchema.parse({ id: "1" })).toEqual({ id: 1 });
        expect(favoriteParamsSchema.parse({ id: "17861" })).toEqual({ id: 17861 });
    });

    it.each(["0", "-1", "1.5", "01", "dark", "", "99999999999999999999"])("reads no id from %j", (id) => {
        expect(favoriteParamsSchema.safeParse({ id }).success).toBe(false);
    });
});

describe("addFavoriteBodySchema", () => {
    it("takes no addedAt, or a time to put a show back", () => {
        expect(addFavoriteBodySchema.parse({})).toEqual({});
        expect(addFavoriteBodySchema.parse({ addedAt: 1_700_000_000_000 })).toEqual({ addedAt: 1_700_000_000_000 });
    });

    it.each([[], null, 5, { addedAt: "1" }, { addedAt: 0 }, { addedAt: 1.5 }])("refuses %j", (body) => {
        expect(addFavoriteBodySchema.safeParse(body).success).toBe(false);
    });
});
