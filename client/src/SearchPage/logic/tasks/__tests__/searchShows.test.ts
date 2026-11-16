import { searchShows } from "../searchShows";

const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("searchShows", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks the server for the encoded query, the page and the genre, with the signal", async () => {
        const answer = { shows: [], genres: [], found: 0, genre: "Science-Fiction", total: 0, page: 2, perPage: 3 };
        const fetchMock = respond(answer);
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        const result = await searchShows({ query: "doctor who & co", genre: "Science-Fiction", page: 2 }, signal);

        expect(result).toEqual(answer);
        expect(fetchMock).toHaveBeenCalledWith("/api/shows?q=doctor+who+%26+co&page=2&genre=Science-Fiction", {
            signal,
        });
    });

    it("leaves the genre out when there is none", async () => {
        const fetchMock = respond({});
        vi.stubGlobal("fetch", fetchMock);

        await searchShows({ query: "dark", genre: null, page: 1 }, new AbortController().signal);

        expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/shows?q=dark&page=1");
    });

    it("rejects when the request fails", async () => {
        vi.stubGlobal("fetch", respond({ error: "TVmaze did not answer" }, 502));

        await expect(
            searchShows({ query: "dark", genre: null, page: 1 }, new AbortController().signal),
        ).rejects.toThrow("502");
    });
});
