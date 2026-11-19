import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "@/stores/favoritesStore/favoritesStore";
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

const save = async (clientId: string, ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => favoritesStore.put(clientId, favorite(id))));
};

const storedIds = async (clientId: string): Promise<number[]> => {
    return (await favoritesStore.list(clientId)).map(({ id }) => id);
};

describe("removeFavorite", () => {
    afterEach(async () => {
        await favoritesStore.clear();
    });

    it("removes the show from the list of the given browser only", async () => {
        await save("c1", [1, 2]);
        await save("c2", [1]);

        await removeFavorite("c1", 1);

        expect(await storedIds("c1")).toEqual([2]);
        expect(await storedIds("c2")).toEqual([1]);
    });

    it("changes nothing when the show is not there, or the browser has no list", async () => {
        await save("c1", [1]);

        await removeFavorite("c1", 5);
        await removeFavorite("c3", 1);

        expect(await storedIds("c1")).toEqual([1]);
        expect(await storedIds("c3")).toEqual([]);
    });
});
