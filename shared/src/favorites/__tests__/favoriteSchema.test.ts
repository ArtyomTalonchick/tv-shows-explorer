import { favoriteSchema } from "../favoriteSchema";

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
