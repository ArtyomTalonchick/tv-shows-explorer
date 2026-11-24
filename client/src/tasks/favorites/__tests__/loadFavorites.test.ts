import type { Favorite, SessionResponse } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { loadFavorites } from "../loadFavorites";

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

describe("loadFavorites", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("loads the signed-in user's favourites with their access token", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify([DARK])));
        vi.stubGlobal("fetch", fetchMock);
        useSessionStore.setState({ session: SESSION });

        await loadFavorites();

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe("/api/favorites");
        expect(new Headers(init.headers).get("Authorization")).toBe("Bearer access");
        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
    });

    it("gives a guest no favourites and asks nothing", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        useSessionStore.setState({ session: null });
        useFavoritesStore.setState({ favorites: [DARK] });

        await loadFavorites();

        expect(fetchMock).not.toHaveBeenCalled();
        expect(useFavoritesStore.getState().favorites).toEqual([]);
    });

    it("rejects and keeps the store as it was when the server fails", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "busy" }), { status: 502 }));
        useSessionStore.setState({ session: SESSION });
        useFavoritesStore.setState({ favorites: [DARK] });

        await expect(loadFavorites()).rejects.toThrow();
        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
    });
});
