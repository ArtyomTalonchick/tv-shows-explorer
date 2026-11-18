import type { Favorite } from "@tv-shows-explorer/shared";
import { createMemoryStore } from "../createMemoryStore";

const favorite = (id: number, addedAt = 100): Favorite => ({
    id,
    name: `Show ${id}`,
    genres: [],
    premiered: null,
    ended: null,
    image: null,
    url: `https://www.tvmaze.com/shows/${id}`,
    addedAt,
});

const clients = (): Map<string, unknown> | undefined => {
    return (globalThis as { favoritesStore?: Map<string, unknown> }).favoritesStore;
};

describe("createMemoryStore", () => {
    const store = createMemoryStore();

    afterEach(async () => {
        await store.clear();
    });

    it("keeps each browser's favorites apart", async () => {
        await store.put("c1", favorite(1));
        await store.put("c2", favorite(2));

        expect(await store.list("c1")).toEqual([favorite(1)]);
        expect(await store.has("c1", 2)).toBe(false);
        expect(await store.has("c2", 2)).toBe(true);
        expect(await store.list("c3")).toEqual([]);
    });

    it("replaces a favorite put again with the same id", async () => {
        await store.put("c1", favorite(1, 100));
        await store.put("c1", favorite(1, 200));

        expect(await store.list("c1")).toEqual([favorite(1, 200)]);
    });

    it("removes a favorite, changes nothing for a missing one, and drops a browser left with none", async () => {
        await store.put("c1", favorite(1));
        await store.put("c1", favorite(2));

        await store.remove("c1", 3);
        await store.remove("c1", 1);
        expect(await store.list("c1")).toEqual([favorite(2)]);

        await store.remove("c1", 2);
        expect(clients()?.has("c1")).toBe(false);
    });

    it("shares one store between its instances, however the module is loaded", async () => {
        await store.put("c1", favorite(1));

        expect(await createMemoryStore().list("c1")).toEqual([favorite(1)]);
    });
});
