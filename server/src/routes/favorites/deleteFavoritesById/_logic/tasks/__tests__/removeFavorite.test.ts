import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/routes/favorites/_stores/favoritesStore";
import { removeFavorite } from "../removeFavorite";

const favorite = (id: number): Favorite => ({
    id,
    name: `Show ${id}`,
    genres: [],
    premiered: null,
    ended: null,
    image: null,
    url: `https://www.tvmaze.com/shows/${id}`,
    addedAt: id * 100,
});

const save = (clientId: string, ids: number[]): void => {
    favoritesStore.set(clientId, new Map(ids.map((id) => [id, favorite(id)])));
};

describe("removeFavorite", () => {
    afterEach(() => {
        favoritesStore.clear();
    });

    it("removes the show from the list of the given browser only", async () => {
        save("c1", [1, 2]);
        save("c2", [1]);

        await removeFavorite("c1", 1);

        expect([...(favoritesStore.get("c1")?.keys() ?? [])]).toEqual([2]);
        expect([...(favoritesStore.get("c2")?.keys() ?? [])]).toEqual([1]);
    });

    it("changes nothing when the show is not there, or the browser has no list", async () => {
        save("c1", [1]);

        await removeFavorite("c1", 5);
        await removeFavorite("c3", 1);

        expect([...(favoritesStore.get("c1")?.keys() ?? [])]).toEqual([1]);
        expect(favoritesStore.has("c3")).toBe(false);
    });

    it("drops a browser left with no favorites from the store", async () => {
        save("c1", [1]);

        await removeFavorite("c1", 1);

        expect(favoritesStore.has("c1")).toBe(false);
    });
});
