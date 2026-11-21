import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/App/_stores/useFavoritesStore";
import { addFavorite } from "../addFavorite";
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

describe("toggleFavorite", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
        vi.spyOn(Date, "now").mockReturnValue(1763300000000);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("adds a show at once, before the server answers", async () => {
        const answer = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValue(answer.promise));

        const toggle = toggleFavorite(DARK_SHOW);

        expect(favorites()).toEqual([DARK]);
        answer.respond(ok(DARK));
        await toggle;
        expect(favorites()).toEqual([DARK]);
    });

    it("takes the show out again when adding fails, and rejects", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(failed()));

        await expect(toggleFavorite(DARK_SHOW)).rejects.toThrow();

        expect(favorites()).toEqual([]);
    });

    it("removes a show at once, and puts it back in its place when removing fails", async () => {
        const older = { ...DARK, id: 1, addedAt: 1 };
        useFavoritesStore.setState({ favorites: [DARK, older] });
        const answer = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValue(answer.promise));

        const toggle = toggleFavorite(DARK);

        expect(favorites()).toEqual([older]);
        answer.respond(failed());
        await expect(toggle).rejects.toThrow();
        expect(favorites()).toEqual([DARK, older]);
    });

    it("keeps the second of two quick presses when the first one fails", async () => {
        const first = deferred();
        const second = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise));

        const add = toggleFavorite(DARK_SHOW);
        const remove = toggleFavorite(DARK_SHOW);
        first.respond(failed());
        second.respond(removed());

        await expect(add).rejects.toThrow();
        await remove;
        expect(favorites()).toEqual([]);
    });

    it("does not bring back a show removed while its adding was on the way", async () => {
        const first = deferred();
        const second = deferred();
        vi.stubGlobal("fetch", vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise));

        const add = toggleFavorite(DARK_SHOW);
        const remove = toggleFavorite(DARK_SHOW);
        first.respond(ok(DARK));
        await add;

        expect(favorites()).toEqual([]);
        second.respond(removed());
        await remove;
        expect(favorites()).toEqual([]);
    });

    it("puts a removed show back in its old place on Undo", async () => {
        const fetchMock = vi.fn().mockResolvedValue(ok(DARK));
        vi.stubGlobal("fetch", fetchMock);

        await addFavorite(DARK, DARK.addedAt);

        expect(favorites()).toEqual([DARK]);
        expect(fetchMock).toHaveBeenCalledWith(
            "/api/favorites/17861",
            expect.objectContaining({ method: "PUT", body: '{"addedAt":1763300000000}' }),
        );
    });
});
