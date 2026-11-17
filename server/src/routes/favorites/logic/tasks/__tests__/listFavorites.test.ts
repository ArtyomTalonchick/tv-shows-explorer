import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/routes/favorites/stores/favoritesStore";
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
    afterEach(() => {
        favoritesStore.clear();
    });

    it("lists the newest first, whatever the order they were stored in", async () => {
        favoritesStore.set(
            "c1",
            new Map([
                [1, favorite(1, 100)],
                [3, favorite(3, 300)],
                [2, favorite(2, 200)],
            ]),
        );

        expect((await listFavorites("c1")).map(({ id }) => id)).toEqual([3, 2, 1]);
    });

    it("lists the given browser's favorites only, and none for a browser without a list", async () => {
        favoritesStore.set("c1", new Map([[1, favorite(1, 100)]]));
        favoritesStore.set("c2", new Map([[2, favorite(2, 100)]]));

        expect(await listFavorites("c2")).toEqual([favorite(2, 100)]);
        expect(await listFavorites("c3")).toEqual([]);
    });
});
