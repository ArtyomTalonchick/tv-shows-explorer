import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/routes/favorites/_stores/favoritesStore/favoritesStore";
import { searchCache } from "@/routes/_stores/searchCache";
import { favorites } from "../favorites";

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

const CLIENT = "0b8f3d6e-6a51-4c2e-9f4b-3f1e2d7c9a10";
const OTHER = "6f1c2a9e-0d4b-4e7a-8c35-b2a9d1e4f701";

const request = async (method: string, path: string, body?: string, clientId: string | null = CLIENT) => {
    const headers: Record<string, string> = clientId === null ? {} : { "X-Client-Id": clientId };
    const response = await favorites.request(path, { method, body, headers });
    return { status: response.status, body: (await response.json()) as unknown };
};

const ids = (body: unknown): number[] => (body as Favorite[]).map(({ id }) => id);

describe("/", () => {
    beforeEach(() => {
        searchCache.set("show", { shows: [show(1), show(2), show(3)], savedAt: 0 });
    });

    afterEach(async () => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
        await favoritesStore.clear();
        searchCache.clear();
    });

    it("lists no favorites at first", async () => {
        expect(await request("GET", "/")).toEqual({ status: 200, body: [] });
    });

    it("adds shows and answers the list, the newest first", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(1000);
        await request("PUT", "/1");
        vi.setSystemTime(2000);
        const added = await request("PUT", "/2");

        expect(added.status).toBe(200);
        expect(added.body).toMatchObject([
            { id: 2, name: "Show 2", addedAt: 2000 },
            { id: 1, addedAt: 1000 },
        ]);
        expect(ids((await request("GET", "/")).body)).toEqual([2, 1]);
    });

    it("is not an error to add a show twice or remove one that is not there, and changes nothing", async () => {
        await request("PUT", "/1");
        const twice = await request("PUT", "/1");
        const missing = await request("DELETE", "/3");

        expect(twice.status).toBe(200);
        expect(missing.status).toBe(200);
        expect(ids(missing.body)).toEqual([1]);
    });

    it("removes a show and answers the list", async () => {
        await request("PUT", "/1");
        await request("PUT", "/2");

        const removed = await request("DELETE", "/2");

        expect(removed.status).toBe(200);
        expect(ids(removed.body)).toEqual([1]);
    });

    it("puts a show back in its old place with the addedAt of the body, for Undo", async () => {
        await request("PUT", "/1", '{ "addedAt": 100 }');
        await request("PUT", "/2", '{ "addedAt": 200 }');
        await request("PUT", "/3", '{ "addedAt": 300 }');
        await request("DELETE", "/2");

        const undone = await request("PUT", "/2", '{ "addedAt": 200 }');

        expect(ids(undone.body)).toEqual([3, 2, 1]);
    });

    it("answers 400 to a wrong id or body, and changes nothing", async () => {
        expect((await request("PUT", "/0")).status).toBe(400);
        expect((await request("PUT", "/dark")).status).toBe(400);
        expect((await request("PUT", "/1", '{ "addedAt": "now" }')).status).toBe(400);
        expect((await request("DELETE", "/-1")).status).toBe(400);
        expect(await favoritesStore.list(CLIENT)).toEqual([]);
    });

    it("keeps a separate list for each browser, and reads the id in any case", async () => {
        await request("PUT", "/1");
        await request("PUT", "/2", undefined, OTHER);

        expect(ids((await request("GET", "/")).body)).toEqual([1]);
        expect(ids((await request("GET", "/", undefined, OTHER.toUpperCase())).body)).toEqual([2]);
    });

    it.each([null, "", "not-a-uuid", `${CLIENT}0`])(
        "answers 400 to the client id %j, and changes nothing",
        async (id) => {
            expect((await request("GET", "/", undefined, id)).status).toBe(400);
            expect((await request("PUT", "/1", undefined, id)).status).toBe(400);
            expect(await favoritesStore.list(CLIENT)).toEqual([]);
        },
    );

    it("answers 404 to a show TVmaze does not have, and 502 when TVmaze fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 404 })));
        expect((await request("PUT", "/99")).status).toBe(404);

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 503 })));
        expect((await request("PUT", "/99")).status).toBe(502);
        expect(await favoritesStore.list(CLIENT)).toEqual([]);
    });
});
