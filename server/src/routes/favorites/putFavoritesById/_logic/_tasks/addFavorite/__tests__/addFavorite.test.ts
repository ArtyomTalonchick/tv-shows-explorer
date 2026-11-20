import type { Show } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/routes/favorites/_stores/favoritesStore/favoritesStore";
import { searchCache } from "@/routes/_stores/searchCache";
import { addFavorite } from "../addFavorite";

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

const respond = (body: unknown, status = 200) =>
    vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status }));

const CLIENT = "c1";
const signal = new AbortController().signal;
const stored = async (clientId = CLIENT) => await favoritesStore.list(clientId);

describe("addFavorite", () => {
    afterEach(async () => {
        vi.unstubAllGlobals();
        await favoritesStore.clear();
        searchCache.clear();
    });

    it("takes a show found by a search from the cache, without TVmaze, and keeps what the list shows", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        searchCache.set("dark", { shows: [show(1), show(2)], savedAt: 0 });

        const added = await addFavorite(CLIENT, 2, 100, signal);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(await stored()).toEqual([added]);
        expect(added).toEqual({
            id: 2,
            name: "Show 2",
            genres: ["Drama"],
            premiered: "2017-12-01",
            ended: null,
            image: "2.jpg",
            url: "https://www.tvmaze.com/shows/2",
            addedAt: 100,
        });
    });

    it("asks TVmaze for a show the cache does not hold", async () => {
        const fetchMock = respond(tvmazeShow(7));
        vi.stubGlobal("fetch", fetchMock);

        await addFavorite(CLIENT, 7, 100, signal);

        expect(fetchMock).toHaveBeenCalledWith("https://api.tvmaze.com/shows/7", { signal });
        expect(await stored()).toMatchObject([{ id: 7, name: "Show 7", image: "7.jpg", addedAt: 100 }]);
    });

    it("rejects with the status when TVmaze has no such show, and adds nothing", async () => {
        vi.stubGlobal("fetch", respond({ name: "Not Found" }, 404));

        await expect(addFavorite(CLIENT, 7, 100, signal)).rejects.toMatchObject({ status: 404 });
        expect(await stored()).toEqual([]);
    });

    it("changes nothing, asks nothing and returns the saved favorite when the show is already there", async () => {
        vi.stubGlobal("fetch", respond(tvmazeShow(7)));
        await addFavorite(CLIENT, 7, 100, signal);
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        const again = await addFavorite(CLIENT, 7, 200, signal);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(again).toMatchObject({ id: 7, addedAt: 100 });
        expect(await stored()).toMatchObject([{ id: 7, addedAt: 100 }]);
    });

    it("adds to the list of the given browser only", async () => {
        searchCache.set("dark", { shows: [show(1), show(2)], savedAt: 0 });

        await addFavorite("c1", 1, 100, signal);
        await addFavorite("c2", 2, 100, signal);

        expect(await stored("c1")).toMatchObject([{ id: 1 }]);
        expect(await stored("c2")).toMatchObject([{ id: 2 }]);
    });
});
