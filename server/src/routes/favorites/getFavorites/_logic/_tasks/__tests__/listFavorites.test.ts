import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "~/routes/favorites/_stores/favoritesStore/favoritesStore";
import { listFavorites } from "../listFavorites";

vi.mock("~/routes/favorites/_stores/favoritesStore/favoritesStore", () => {
    return { favoritesStore: { list: vi.fn() } };
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

describe("listFavorites", () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it("lists the newest first, whatever the order they were stored in", async () => {
        vi.mocked(favoritesStore.list).mockResolvedValue([favorite(1, 100), favorite(3, 300), favorite(2, 200)]);

        expect((await listFavorites("c1")).map(({ id }) => id)).toEqual([3, 2, 1]);
    });

    it("asks the store for the given browser's favorites", async () => {
        vi.mocked(favoritesStore.list).mockResolvedValue([]);

        expect(await listFavorites("c2")).toEqual([]);
        expect(favoritesStore.list).toHaveBeenCalledWith("c2");
    });
});
