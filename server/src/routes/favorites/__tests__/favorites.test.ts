import { sign } from "hono/jwt";
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

const SECRET = "test-secret";
const ANNA = "u1";
const BEN = "u2";

// A token of this server, without `iat`: a test sets the clock back, and a token issued "later" would be refused.
const tokenOf = async (userId: string, typ = "access", secret = SECRET): Promise<string> => {
    return await sign({ sub: userId, typ, exp: Math.floor(Date.now() / 1000) + 60 }, secret, "HS256");
};

const bearerOf = async (userId: string): Promise<string> => `Bearer ${await tokenOf(userId)}`;

// A request of Anna unless another `Authorization` header is given; null sends none.
const request = async (method: string, path: string, body?: string, authorization?: string | null) => {
    const header = authorization === undefined ? await bearerOf(ANNA) : authorization;
    const headers: Record<string, string> = header === null ? {} : { Authorization: header };
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
        vi.stubEnv("JWT_SECRET", SECRET);
        searchCache.set("show", { shows: [show(1), show(2), show(3)], savedAt: 0 });
        vi.mocked(favoritesStore.list).mockResolvedValue([]);
        vi.mocked(favoritesStore.get).mockResolvedValue(null);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
        vi.useRealTimers();
        searchCache.clear();
    });

    it("lists the user's favorites the newest first", async () => {
        vi.mocked(favoritesStore.list).mockResolvedValue([favorite(1, 100), favorite(2, 200)]);

        const listed = await request("GET", "/");

        expect(listed).toEqual({ status: 200, body: [favorite(2, 200), favorite(1, 100)] });
        expect(favoritesStore.list).toHaveBeenCalledWith(ANNA);
    });

    it("keeps a list of its own for each user", async () => {
        vi.mocked(favoritesStore.list).mockImplementation(async (userId) => {
            return userId === ANNA ? [favorite(1, 100)] : [favorite(2, 200)];
        });

        const annas = await request("GET", "/");
        const bens = await request("GET", "/", undefined, await bearerOf(BEN));
        await request("DELETE", "/2", undefined, await bearerOf(BEN));

        expect(annas.body).toEqual([favorite(1, 100)]);
        expect(bens.body).toEqual([favorite(2, 200)]);
        expect(favoritesStore.remove).toHaveBeenCalledExactlyOnceWith(BEN, 2);
    });

    it("adds a show now and answers only the one added", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(2000);

        const added = await request("PUT", "/2");

        expect(added).toEqual({ status: 200, body: favorite(2, 2000) });
        expect(favoritesStore.put).toHaveBeenCalledExactlyOnceWith(ANNA, favorite(2, 2000));
    });

    it("puts a show back with the addedAt of the body, in its old place", async () => {
        const putBack = await request("PUT", "/2", '{ "addedAt": 200 }');

        expect(putBack).toEqual({ status: 200, body: favorite(2, 200) });
        expect(favoritesStore.put).toHaveBeenCalledExactlyOnceWith(ANNA, favorite(2, 200));
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
        expect(favoritesStore.remove).toHaveBeenCalledExactlyOnceWith(ANNA, 2);
    });

    it("answers 400 to a wrong id or body, and changes nothing", async () => {
        expect((await request("PUT", "/0")).status).toBe(400);
        expect((await request("PUT", "/dark")).status).toBe(400);
        expect((await request("PUT", "/1", '{ "addedAt": "now" }')).status).toBe(400);
        expect((await request("DELETE", "/-1")).status).toBe(400);
        storeUntouched();
    });

    it.each([
        ["no token", async () => null],
        ["a token of another secret", async () => `Bearer ${await tokenOf(ANNA, "access", "other-secret")}`],
        ["a refresh token", async () => `Bearer ${await tokenOf(ANNA, "refresh")}`],
        ["a token without Bearer", async () => await tokenOf(ANNA)],
    ])("answers 401 to a guest with %s, and changes nothing", async (_case, authorization) => {
        const header = await authorization();

        expect((await request("GET", "/", undefined, header)).status).toBe(401);
        expect((await request("PUT", "/1", undefined, header)).status).toBe(401);
        expect((await request("DELETE", "/1", undefined, header)).status).toBe(401);
        storeUntouched();
    });

    it("answers 404 to a show TVmaze does not have, and 502 when TVmaze fails or answers no show", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 404 })));
        expect((await request("PUT", "/99")).status).toBe(404);

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 503 })));
        expect((await request("PUT", "/99")).status).toBe(502);

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{ "id": 99 }', { status: 200 })));
        expect((await request("PUT", "/99")).status).toBe(502);
        expect(favoritesStore.put).not.toHaveBeenCalled();
    });
});
