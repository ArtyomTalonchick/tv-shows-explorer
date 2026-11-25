import type { Favorite } from "@tv-shows-explorer/shared";
import { useRemovedFavoritesStore } from "../useRemovedFavoritesStore";

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

const removed = (): Favorite[] => useRemovedFavoritesStore.getState().removed;

describe("useRemovedFavoritesStore", () => {
    beforeEach(() => {
        useRemovedFavoritesStore.setState({ removed: [favorite(1, 100)] });
    });

    it("finds a removed favorite by its id, and answers null for a show not removed", () => {
        expect(useRemovedFavoritesStore.getState().find(1)).toEqual(favorite(1, 100));
        expect(useRemovedFavoritesStore.getState().find(9)).toBeNull();
    });

    it("remembers a removed favorite, replacing the one with its id", () => {
        useRemovedFavoritesStore.getState().remember(favorite(2, 200));
        useRemovedFavoritesStore.getState().remember(favorite(1, 150));

        expect(removed()).toEqual([favorite(2, 200), favorite(1, 150)]);
    });

    it("forgets a removed favorite by its id, and changes nothing for a missing one", () => {
        useRemovedFavoritesStore.getState().forget(9);
        useRemovedFavoritesStore.getState().forget(1);

        expect(removed()).toEqual([]);
    });

    it("clears the removed favorites", () => {
        useRemovedFavoritesStore.getState().clear();

        expect(removed()).toEqual([]);
    });
});
