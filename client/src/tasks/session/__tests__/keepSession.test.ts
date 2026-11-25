import type { Favorite, SessionResponse } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { keepSession } from "../keepSession";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

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

describe("keepSession", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: null });
        useFavoritesStore.setState({ favorites: [], removed: [] });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("keeps the session and loads the user's favourites with its access token", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify([DARK])));
        vi.stubGlobal("fetch", fetchMock);

        await keepSession(SESSION, null);

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe("/api/favorites");
        expect(new Headers(init.headers).get("Authorization")).toBe("Bearer access");
        expect(useSessionStore.getState().session).toEqual(SESSION);
        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
    });

    it("keeps the session with no favourites, and does not reject, when the load fails", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "busy" }), { status: 502 }));

        await expect(keepSession(SESSION, DARK)).resolves.toBeUndefined();
        expect(useSessionStore.getState().session).toEqual(SESSION);
        expect(useFavoritesStore.getState().favorites).toEqual([]);
    });

    it("adds the show bookmarked as a guest once the list is loaded", async () => {
        const older = { ...DARK, id: 1, addedAt: 1 };
        vi.spyOn(Date, "now").mockReturnValue(DARK.addedAt);
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(new Response(JSON.stringify([older])))
            .mockResolvedValueOnce(new Response(JSON.stringify(DARK)));
        vi.stubGlobal("fetch", fetchMock);

        await keepSession(SESSION, DARK);

        expect(useFavoritesStore.getState().favorites).toEqual([DARK, older]);
        expect(fetchMock.mock.calls.map(([, init]) => (init as RequestInit).method)).toEqual(["GET", "PUT"]);
    });

    it("does not reject when adding the bookmarked show fails, and leaves it out", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(new Response(JSON.stringify([])))
            .mockResolvedValueOnce(new Response(JSON.stringify({ error: "busy" }), { status: 502 }));
        vi.stubGlobal("fetch", fetchMock);

        await expect(keepSession(SESSION, DARK)).resolves.toBeUndefined();
        expect(useFavoritesStore.getState().favorites).toEqual([]);
    });
});
