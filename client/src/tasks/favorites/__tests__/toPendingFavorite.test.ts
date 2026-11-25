import type { Show } from "@tv-shows-explorer/shared";
import { toPendingFavorite } from "../toPendingFavorite";

const DARK: Omit<Show, "rating"> = {
    id: 17861,
    name: "Dark",
    genres: ["Drama"],
    premiered: "2017-12-01",
    ended: null,
    image: null,
    url: "https://www.tvmaze.com/shows/17861/dark",
};

describe("toPendingFavorite", () => {
    it("returns the show the state holds, with nothing else", () => {
        expect(toPendingFavorite({ ...DARK, rating: 8.7 })).toEqual(DARK);
    });

    it.each([
        ["no state", null],
        ["a state of another kind", "dark"],
        ["a show with no id", { ...DARK, id: undefined }],
        ["a show with a wrong genre", { ...DARK, genres: [1] }],
        ["a show with a wrong date", { ...DARK, premiered: 2017 }],
    ])("returns null for %s", (_, state) => {
        expect(toPendingFavorite(state)).toBeNull();
    });
});
