import type { ShowsPage } from "@tv-shows-explorer/shared";
import type { SearchAnswer } from "@/stores/useSearchStore";
import { getSearchStatus, type SearchStatus } from "../getSearchStatus";

const pageOf = (found: number): ShowsPage => ({
    shows: [],
    genres: [],
    found,
    genre: null,
    total: found,
    page: 1,
    perPage: 3,
});

const answerOf = (data: ShowsPage | null): SearchAnswer => ({ query: "dark", data, failed: data === null });

describe("getSearchStatus", () => {
    it.each<[string, string, SearchAnswer | null, SearchStatus]>([
        ["an empty field", "", answerOf(pageOf(3)), "idle"],
        ["a field of spaces", "   ", null, "idle"],
        ["no answer on screen", "dark", null, "loading"],
        ["found shows", "dark", answerOf(pageOf(3)), "results"],
        ["nothing found", "dark", answerOf(pageOf(0)), "empty"],
        ["a failed answer", "dark", answerOf(null), "error"],
    ])("for %s is %s", (_, value, answer, status) => {
        expect(getSearchStatus(value, answer)).toBe(status);
    });
});
