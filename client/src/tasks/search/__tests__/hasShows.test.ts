import type { ShowsPage } from "@tv-shows-explorer/shared";
import type { SearchAnswer } from "~/stores/useSearchStore";
import { hasShows } from "../hasShows";

const pageOf = (found: number): ShowsPage => ({
    shows: [],
    genres: [],
    found,
    genre: null,
    total: found,
    page: 1,
    perPage: 3,
});

describe("hasShows", () => {
    it.each<[string, SearchAnswer | null, boolean]>([
        ["no answer", null, false],
        ["a failed answer", { query: "dark", data: null, failed: true }, false],
        ["an answer with nothing found", { query: "dark", data: pageOf(0), failed: false }, false],
        ["an answer with found shows", { query: "dark", data: pageOf(4), failed: false }, true],
    ])("is %s → %s", (_, answer, expected) => {
        expect(hasShows(answer)).toBe(expected);
    });
});
