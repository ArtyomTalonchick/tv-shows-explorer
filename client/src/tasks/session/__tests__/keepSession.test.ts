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
        useFavoritesStore.setState({ favorites: [] });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("keeps the session and loads the user's favourites with its access token", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify([DARK])));
        vi.stubGlobal("fetch", fetchMock);

        await keepSession(SESSION);

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe("/api/favorites");
        expect(new Headers(init.headers).get("Authorization")).toBe("Bearer access");
        expect(useSessionStore.getState().session).toEqual(SESSION);
        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
    });

    it("keeps the session with no favourites, and does not reject, when the load fails", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "busy" }), { status: 502 }));

        await expect(keepSession(SESSION)).resolves.toBeUndefined();
        expect(useSessionStore.getState().session).toEqual(SESSION);
        expect(useFavoritesStore.getState().favorites).toEqual([]);
    });
});
