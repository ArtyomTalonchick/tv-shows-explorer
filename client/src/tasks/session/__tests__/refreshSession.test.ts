import type { Favorite, SessionResponse } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { refreshSession } from "../refreshSession";

const KEPT: SessionResponse = {
    accessToken: "old-access",
    refreshToken: "old-refresh",
    user: { id: "u1", email: "anna@example.com" },
};

const FRESH: SessionResponse = { ...KEPT, accessToken: "new-access", refreshToken: "new-refresh" };

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

const answer = (status: number, body: unknown): Response => new Response(JSON.stringify(body), { status });

describe("refreshSession", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: KEPT });
        useFavoritesStore.setState({ favorites: [DARK] });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("exchanges the kept refresh token for a new session", async () => {
        const fetchMock = vi.fn(async () => answer(200, FRESH));
        vi.stubGlobal("fetch", fetchMock);

        await refreshSession(new AbortController().signal);

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe("/api/session/refresh");
        expect(init.method).toBe("POST");
        expect(init.body).toBe(JSON.stringify({ refreshToken: "old-refresh" }));
        expect(useSessionStore.getState().session).toEqual(FRESH);
    });

    it("sends nothing for a guest", async () => {
        useSessionStore.setState({ session: null });
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        await refreshSession(new AbortController().signal);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(useSessionStore.getState().session).toBeNull();
    });

    it.each([401, 400])("signs the user out when the server refuses the token with %i", async (status) => {
        vi.stubGlobal("fetch", async () => answer(status, { error: "refused" }));

        await refreshSession(new AbortController().signal);

        expect(useSessionStore.getState().session).toBeNull();
        expect(useFavoritesStore.getState().favorites).toEqual([]);
    });

    it("keeps the session when there is no answer or the server fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockRejectedValueOnce(new TypeError("offline")).mockResolvedValue(answer(500, {})),
        );

        await refreshSession(new AbortController().signal);
        await refreshSession(new AbortController().signal);

        expect(useSessionStore.getState().session).toEqual(KEPT);
        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
    });

    it.each([
        { during: "a sign-out", now: null, status: 200, body: FRESH },
        { during: "another sign-in", now: { ...FRESH, refreshToken: "other-refresh" }, status: 401, body: {} },
    ])("drops an answer that comes after $during", async ({ now, status, body }) => {
        vi.stubGlobal("fetch", async () => {
            useSessionStore.setState({ session: now });
            return answer(status, body);
        });

        await refreshSession(new AbortController().signal);

        expect(useSessionStore.getState().session).toEqual(now);
    });
});
