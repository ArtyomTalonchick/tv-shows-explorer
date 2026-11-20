import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/routes/favorites/_stores/favoritesStore/favoritesStore";
import { listFavorites } from "../listFavorites";

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

describe("listFavorites", () => {
    afterEach(async () => {
        await favoritesStore.clear();
    });

    it("lists the newest first, whatever the order they were stored in", async () => {
        await favoritesStore.put("c1", favorite(1, 100));
        await favoritesStore.put("c1", favorite(3, 300));
        await favoritesStore.put("c1", favorite(2, 200));

        expect((await listFavorites("c1")).map(({ id }) => id)).toEqual([3, 2, 1]);
    });

    it("lists the given browser's favorites only, and none for a browser without a list", async () => {
        await favoritesStore.put("c1", favorite(1, 100));
        await favoritesStore.put("c2", favorite(2, 100));

        expect(await listFavorites("c2")).toEqual([favorite(2, 100)]);
        expect(await listFavorites("c3")).toEqual([]);
    });
});
