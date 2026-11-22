import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { favoritesStore } from "~/routes/favorites/_stores/favoritesStore/favoritesStore";
import { searchCache } from "~/routes/_stores/searchCache";
import { favorites } from "../favorites";

vi.mock("~/routes/favorites/_stores/favoritesStore/favoritesStore", () => {
    return { favoritesStore: { list: vi.fn(), get: vi.fn(), put: vi.fn(), remove: vi.fn() } };
});

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

const favorite = (id: number, addedAt: number): Favorite => ({
    id,
    name: `Show ${id}`,
    genres: [],
    premiered: null,
    ended: null,
    image: null,
    url: `https://www.tvmaze.com/shows/${id}`,
    addedAt,
});

const CLIENT = "0b8f3d6e-6a51-4c2e-9f4b-3f1e2d7c9a10";

const request = async (method: string, path: string, body?: string, clientId: string | null = CLIENT) => {
    const headers: Record<string, string> = clientId === null ? {} : { "X-Client-Id": clientId };
    const response = await favorites.request(path, { method, body, headers });
    const text = await response.text();
    return { status: response.status, body: text === "" ? null : (JSON.parse(text) as unknown) };
};

const storeUntouched = (): void => {
    expect(favoritesStore.list).not.toHaveBeenCalled();
    expect(favoritesStore.get).not.toHaveBeenCalled();
    expect(favoritesStore.put).not.toHaveBeenCalled();
    expect(favoritesStore.remove).not.toHaveBeenCalled();
};

describe("/", () => {
    beforeEach(() => {
        searchCache.set("show", { shows: [show(1), show(2), show(3)], savedAt: 0 });
        vi.mocked(favoritesStore.list).mockResolvedValue([]);
        vi.mocked(favoritesStore.get).mockResolvedValue(null);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllGlobals();
        vi.useRealTimers();
        searchCache.clear();
    });

    it("lists the browser's favorites the newest first, reading its id in any case", async () => {
        vi.mocked(favoritesStore.list).mockResolvedValue([favorite(1, 100), favorite(2, 200)]);

        const listed = await request("GET", "/", undefined, CLIENT.toUpperCase());

        expect(listed).toEqual({ status: 200, body: [favorite(2, 200), favorite(1, 100)] });
        expect(favoritesStore.list).toHaveBeenCalledWith(CLIENT);
    });

    it("adds a show now and answers only the one added", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(2000);

        const added = await request("PUT", "/2");

        expect(added).toEqual({ status: 200, body: favorite(2, 2000) });
        expect(favoritesStore.put).toHaveBeenCalledExactlyOnceWith(CLIENT, favorite(2, 2000));
    });

    it("puts a show back with the addedAt of the body, for Undo", async () => {
        const undone = await request("PUT", "/2", '{ "addedAt": 200 }');

        expect(undone).toEqual({ status: 200, body: favorite(2, 200) });
        expect(favoritesStore.put).toHaveBeenCalledExactlyOnceWith(CLIENT, favorite(2, 200));
    });

    it("is not an error to add a show twice: answers the saved one and changes nothing", async () => {
        vi.mocked(favoritesStore.get).mockResolvedValue(favorite(1, 100));

        const twice = await request("PUT", "/1", '{ "addedAt": 200 }');

        expect(twice).toEqual({ status: 200, body: favorite(1, 100) });
        expect(favoritesStore.put).not.toHaveBeenCalled();
    });

    it("removes a show and answers 204 with no body", async () => {
        const removed = await request("DELETE", "/2");

        expect(removed).toEqual({ status: 204, body: null });
        expect(favoritesStore.remove).toHaveBeenCalledExactlyOnceWith(CLIENT, 2);
    });

    it("answers 400 to a wrong id or body, and changes nothing", async () => {
        expect((await request("PUT", "/0")).status).toBe(400);
        expect((await request("PUT", "/dark")).status).toBe(400);
        expect((await request("PUT", "/1", '{ "addedAt": "now" }')).status).toBe(400);
        expect((await request("DELETE", "/-1")).status).toBe(400);
        storeUntouched();
    });

    it.each([null, "", "not-a-uuid", `${CLIENT}0`])(
        "answers 400 to the client id %j, and changes nothing",
        async (id) => {
            expect((await request("GET", "/", undefined, id)).status).toBe(400);
            expect((await request("PUT", "/1", undefined, id)).status).toBe(400);
            storeUntouched();
        },
    );

    it("answers 404 to a show TVmaze does not have, and 502 when TVmaze fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 404 })));
        expect((await request("PUT", "/99")).status).toBe(404);

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 503 })));
        expect((await request("PUT", "/99")).status).toBe(502);
        expect(favoritesStore.put).not.toHaveBeenCalled();
    });
});
