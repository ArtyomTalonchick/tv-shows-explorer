import { searchCache } from "@/stores/searchCache";
import { searchTvmaze } from "../searchTvmaze";

const respond = (body: unknown, status = 200) =>
    vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status }));

const MINUTE = 60 * 1000;

describe("searchTvmaze", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
        searchCache.clear();
    });

    it("answers a query repeated within 5 minutes from the cache, without TVmaze", async () => {
        vi.useFakeTimers();
        const fetchMock = respond([]);
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await searchTvmaze("dark", signal);
        vi.advanceTimersByTime(5 * MINUTE - 1);
        await searchTvmaze("dark", signal);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("asks TVmaze again after 5 minutes", async () => {
        vi.useFakeTimers();
        const fetchMock = respond([]);
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await searchTvmaze("dark", signal);
        vi.advanceTimersByTime(5 * MINUTE);
        await searchTvmaze("dark", signal);

        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not cache a failed answer, so Retry asks TVmaze again", async () => {
        vi.stubGlobal("fetch", respond({ message: "busy" }, 503));
        await expect(searchTvmaze("dark", new AbortController().signal)).rejects.toThrow("503");

        const fetchMock = respond([]);
        vi.stubGlobal("fetch", fetchMock);
        await searchTvmaze("dark", new AbortController().signal);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("asks TVmaze with the encoded query and the signal", async () => {
        const fetchMock = respond([]);
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await searchTvmaze("doctor who & co", signal);

        expect(fetchMock).toHaveBeenCalledWith("https://api.tvmaze.com/search/shows?q=doctor%20who%20%26%20co", {
            signal,
        });
    });

    it("maps the results, with no rating and no image as null", async () => {
        vi.stubGlobal(
            "fetch",
            respond([
                {
                    score: 0.9,
                    show: {
                        id: 1,
                        name: "Dark",
                        genres: ["Drama"],
                        rating: { average: 8.2 },
                        premiered: "2017-12-01",
                        ended: "2020-06-27",
                        image: { medium: "m.jpg", original: "o.jpg" },
                        url: "https://www.tvmaze.com/shows/17861/dark",
                    },
                },
                {
                    score: 0.5,
                    show: {
                        id: 2,
                        name: "Darkroom",
                        genres: [],
                        rating: { average: null },
                        premiered: null,
                        ended: null,
                        image: null,
                        url: "https://www.tvmaze.com/shows/2/darkroom",
                    },
                },
            ]),
        );

        await expect(searchTvmaze("dark", new AbortController().signal)).resolves.toEqual([
            {
                id: 1,
                name: "Dark",
                genres: ["Drama"],
                rating: 8.2,
                premiered: "2017-12-01",
                ended: "2020-06-27",
                image: "m.jpg",
                url: "https://www.tvmaze.com/shows/17861/dark",
            },
            {
                id: 2,
                name: "Darkroom",
                genres: [],
                rating: null,
                premiered: null,
                ended: null,
                image: null,
                url: "https://www.tvmaze.com/shows/2/darkroom",
            },
        ]);
    });

    it("rejects when the request fails", async () => {
        vi.stubGlobal("fetch", respond({ message: "busy" }, 503));

        await expect(searchTvmaze("dark", new AbortController().signal)).rejects.toThrow("503");
    });
});
