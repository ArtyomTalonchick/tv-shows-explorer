import type { Favorite, SessionResponse, Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useRemovedFavoritesStore } from "~/App/_stores/useRemovedFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { toggleFavorite } from "../toggleFavorite";

const DARK_SHOW: Show = {
    id: 17861,
    name: "Dark",
    genres: ["Drama"],
    rating: 8.4,
    premiered: "2017-12-01",
    ended: "2020-06-27",
    image: null,
    url: "https://www.tvmaze.com/shows/17861/dark",
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

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

// A response the test sends when it says so.
const deferred = () => {
    const callbacks: { respond: (response: Response) => void } = { respond: () => {} };
    const promise = new Promise<Response>((resolve) => {
        callbacks.respond = resolve;
    });
    return { promise, ...callbacks };
};

const ok = (body: unknown) => new Response(JSON.stringify(body));
const removed = () => new Response(null, { status: 204 });
const failed = () => new Response(JSON.stringify({ error: "busy" }), { status: 502 });

const favorites = () => useFavoritesStore.getState().favorites;
const isSaved = () => useFavoritesStore.getState().findFavorite(DARK.id) !== null;

describe("toggleFavorite", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
        useRemovedFavoritesStore.setState({ removed: [] });
        useSessionStore.setState({ session: SESSION });
        vi.spyOn(Date, "now").mockReturnValue(1763300000000);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("adds a show at once, before the server answers", async () => {
        const answer = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValue(answer.promise));

        const { request: toggle } = toggleFavorite(DARK_SHOW);

        expect(favorites()).toEqual([DARK]);
        answer.respond(ok(DARK));
        await toggle;
        expect(favorites()).toEqual([DARK]);
    });

    it("changes nothing and sends nothing for a guest", async () => {
        useSessionStore.setState({ session: null });
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        const toggling = toggleFavorite(DARK_SHOW);

        expect(toggling.isGuest).toBe(true);
        await toggling.request;
        expect(favorites()).toEqual([]);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("takes the show out again when adding fails, and rejects", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(failed()));

        await expect(toggleFavorite(DARK_SHOW).request).rejects.toThrow();

        expect(isSaved()).toBe(false);
    });

    it("removes a show at once, and puts it back in its place when removing fails", async () => {
        const older = { ...DARK, id: 1, addedAt: 1 };
        useFavoritesStore.setState({ favorites: [DARK, older] });
        const answer = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValue(answer.promise));

        const { request: toggle } = toggleFavorite(DARK);

        expect(favorites()).toEqual([older]);
        expect(useRemovedFavoritesStore.getState().removed).toEqual([DARK]);
        answer.respond(failed());
        await expect(toggle).rejects.toThrow();
        expect(favorites()).toEqual([DARK, older]);
        expect(useRemovedFavoritesStore.getState().removed).toEqual([]);
    });

    it("keeps the second of two quick presses when the first one fails", async () => {
        const first = deferred();
        const second = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise));

        const { request: add } = toggleFavorite(DARK_SHOW);
        const { request: remove } = toggleFavorite(DARK_SHOW);
        first.respond(failed());
        second.respond(removed());

        await expect(add).rejects.toThrow();
        await remove;
        expect(isSaved()).toBe(false);
    });

    it("does not bring back a show removed while its adding was on the way", async () => {
        const first = deferred();
        const second = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise));

        const { request: add } = toggleFavorite(DARK_SHOW);
        const { request: remove } = toggleFavorite(DARK_SHOW);
        first.respond(ok(DARK));
        await add;

        expect(isSaved()).toBe(false);
        second.respond(removed());
        await remove;
        expect(isSaved()).toBe(false);
    });

    it("sends the time a new show was added", async () => {
        const fetchMock = vi.fn().mockResolvedValue(ok(DARK));
        vi.stubGlobal("fetch", fetchMock);

        await toggleFavorite(DARK_SHOW).request;

        expect(fetchMock.mock.lastCall?.[1]).toMatchObject({
            method: "PUT",
            body: JSON.stringify({ addedAt: DARK.addedAt }),
        });
    });

    it("puts a removed show back in its place with its old addedAt", async () => {
        const older = { ...DARK, id: 1, addedAt: 1 };
        const newer = { ...DARK, id: 2, addedAt: 1763400000000 };
        useFavoritesStore.setState({ favorites: [newer, older] });
        useRemovedFavoritesStore.setState({ removed: [{ ...DARK, addedAt: 1000 }] });
        const fetchMock = vi.fn().mockResolvedValue(ok(DARK));
        vi.stubGlobal("fetch", fetchMock);

        await toggleFavorite(DARK_SHOW).request;

        expect(favorites()).toEqual([newer, { ...DARK, addedAt: 1000 }, older]);
        expect(fetchMock.mock.lastCall?.[1]).toMatchObject({ method: "PUT", body: JSON.stringify({ addedAt: 1000 }) });
    });
});
