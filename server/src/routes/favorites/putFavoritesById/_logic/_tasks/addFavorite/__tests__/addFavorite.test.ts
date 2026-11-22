import type { Favorite, Show } from "@tv-shows-explorer/shared";
import { favoritesStore } from "~/routes/favorites/_stores/favoritesStore/favoritesStore";
import { searchCache } from "~/routes/_stores/searchCache";
import { addFavorite } from "../addFavorite";

vi.mock("~/routes/favorites/_stores/favoritesStore/favoritesStore", () => {
    return { favoritesStore: { get: vi.fn(), put: vi.fn() } };
});

const show = (id: number): Show => ({
    id,
    name: `Show ${id}`,
    genres: ["Drama"],
    rating: 8,
    premiered: "2017-12-01",
    ended: null,
    image: `${id}.jpg`,
    url: `https://www.tvmaze.com/shows/${id}`,
});

const tvmazeShow = (id: number) => ({
    id,
    name: `Show ${id}`,
    genres: ["Drama"],
    rating: { average: 8 },
    premiered: "2017-12-01",
    ended: null,
    image: { medium: `${id}.jpg`, original: `${id}-big.jpg` },
    url: `https://www.tvmaze.com/shows/${id}`,
});

const favorite = (id: number, addedAt: number): Favorite => ({
    id,
    name: `Show ${id}`,
    genres: ["Drama"],
    premiered: "2017-12-01",
    ended: null,
    image: `${id}.jpg`,
    url: `https://www.tvmaze.com/shows/${id}`,
    addedAt,
});

const respond = (body: unknown, status = 200) =>
    vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status }));

const CLIENT = "c1";
const signal = new AbortController().signal;

describe("addFavorite", () => {
    beforeEach(() => {
        vi.mocked(favoritesStore.get).mockResolvedValue(null);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllGlobals();
        searchCache.clear();
    });

    it("takes a show found by a search from the cache, without TVmaze, and keeps what the list shows", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        searchCache.set("dark", { shows: [show(1), show(2)], savedAt: 0 });

        const added = await addFavorite(CLIENT, 2, 100, signal);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(added).toEqual(favorite(2, 100));
        expect(favoritesStore.put).toHaveBeenCalledExactlyOnceWith(CLIENT, favorite(2, 100));
    });

    it("asks TVmaze for a show the cache does not hold", async () => {
        const fetchMock = respond(tvmazeShow(7));
        vi.stubGlobal("fetch", fetchMock);

        await addFavorite(CLIENT, 7, 100, signal);

        expect(fetchMock).toHaveBeenCalledWith("https://api.tvmaze.com/shows/7", { signal });
        expect(favoritesStore.put).toHaveBeenCalledExactlyOnceWith(CLIENT, favorite(7, 100));
    });

    it("rejects with the status when TVmaze has no such show, and adds nothing", async () => {
        vi.stubGlobal("fetch", respond({ name: "Not Found" }, 404));

        await expect(addFavorite(CLIENT, 7, 100, signal)).rejects.toMatchObject({ status: 404 });
        expect(favoritesStore.put).not.toHaveBeenCalled();
    });

    it("changes nothing, asks nothing and returns the saved favorite when the show is already there", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        vi.mocked(favoritesStore.get).mockResolvedValue(favorite(7, 100));

        const again = await addFavorite(CLIENT, 7, 200, signal);

        expect(favoritesStore.get).toHaveBeenCalledWith(CLIENT, 7);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(favoritesStore.put).not.toHaveBeenCalled();
        expect(again).toEqual(favorite(7, 100));
    });
});
