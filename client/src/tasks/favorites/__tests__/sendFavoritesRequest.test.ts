import type { Favorite } from "@tv-shows-explorer/shared";
import { getClientId } from "../getClientId";
import { sendFavoritesRequest } from "../sendFavoritesRequest";

const DARK: Favorite = {
    id: 17861,
    name: "Dark",
    genres: ["Drama"],
    premiered: "2017-12-01",
    ended: "2020-06-27",
    image: null,
    url: "https://www.tvmaze.com/shows/17861/dark",
    addedAt: 1763300000000,
};

const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("getClientId", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("makes a UUID once and keeps it", () => {
        const first = getClientId();

        expect(first).toMatch(/^[0-9a-f-]{36}$/);
        expect(getClientId()).toBe(first);
    });
});

describe("sendFavoritesRequest", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks for the list as this browser and returns the answer", async () => {
        const fetchMock = respond([DARK]);
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await expect(sendFavoritesRequest({ method: "GET", signal })).resolves.toEqual([DARK]);
        expect(fetchMock).toHaveBeenCalledWith("/api/favorites", {
            method: "GET",
            headers: { "X-Client-Id": getClientId() },
            body: undefined,
            signal,
        });
    });

    it("sends the show's id and a JSON body", async () => {
        const fetchMock = respond(DARK);
        vi.stubGlobal("fetch", fetchMock);

        await expect(
            sendFavoritesRequest({ method: "PUT", id: 17861, body: { addedAt: DARK.addedAt } }),
        ).resolves.toEqual(DARK);
        const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
        const headers = new Headers(init.headers);
        expect(url).toBe("/api/favorites/17861");
        expect(init.method).toBe("PUT");
        expect(init.body).toBe('{"addedAt":1763300000000}');
        expect(headers.get("X-Client-Id")).toBe(getClientId());
        expect(headers.get("Content-Type")).toBe("application/json");
    });

    it("rejects when the server fails", async () => {
        vi.stubGlobal("fetch", respond({ error: "TVmaze did not answer" }, 502));

        await expect(sendFavoritesRequest({ method: "DELETE", id: 17861 })).rejects.toThrow();
    });
});
