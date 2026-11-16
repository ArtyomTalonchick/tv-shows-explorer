import type { Show } from "@tv-shows-explorer/shared";
import { searchCache } from "@/stores/searchCache";
import { dropExpiredSearches } from "../dropExpiredSearches";
import { readCachedSearch } from "../readCachedSearch";
import { writeCachedSearch } from "../writeCachedSearch";

const show = (id: number): Show => ({
    id,
    name: `Show ${id}`,
    genres: [],
    rating: null,
    premiered: null,
    ended: null,
    image: null,
    url: `https://www.tvmaze.com/shows/${id}`,
});

const MINUTE = 60 * 1000;

describe("readCachedSearch, writeCachedSearch and dropExpiredSearches", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-16T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
        searchCache.clear();
    });

    it("misses a query that was never saved", () => {
        expect(readCachedSearch("dark")).toBeNull();
    });

    it("hits a query saved less than 5 minutes ago", () => {
        writeCachedSearch("dark", [show(1)]);
        vi.advanceTimersByTime(5 * MINUTE - 1);

        expect(readCachedSearch("dark")).toEqual([show(1)]);
    });

    it("misses a query saved 5 minutes ago or earlier", () => {
        writeCachedSearch("dark", [show(1)]);
        vi.advanceTimersByTime(5 * MINUTE);

        expect(readCachedSearch("dark")).toBeNull();
    });

    it("replaces an entry with a newer answer", () => {
        writeCachedSearch("dark", [show(1)]);
        vi.advanceTimersByTime(6 * MINUTE);
        writeCachedSearch("dark", [show(2)]);
        vi.advanceTimersByTime(4 * MINUTE);

        expect(readCachedSearch("dark")).toEqual([show(2)]);
    });

    it("drops the entries 5 minutes old or older and keeps the younger ones", () => {
        writeCachedSearch("dark", [show(1)]);
        vi.advanceTimersByTime(3 * MINUTE);
        writeCachedSearch("lost", [show(2)]);
        vi.advanceTimersByTime(2 * MINUTE);

        dropExpiredSearches();

        expect([...searchCache.keys()]).toEqual(["lost"]);
    });

    it("does not take a query for a key of the object prototype", () => {
        expect(readCachedSearch("constructor")).toBeNull();
    });
});
