import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "../useFavoritesStore";

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

const ids = (): number[] => useFavoritesStore.getState().favorites.map(({ id }) => id);
const removed = (): Favorite[] => useFavoritesStore.getState().removed;

describe("useFavoritesStore", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [favorite(3, 300), favorite(1, 100)], removed: [favorite(1, 100)] });
    });

    it("finds a removed favorite by its id, and answers null for a show not removed", () => {
        expect(useFavoritesStore.getState().findRemoved(1)).toEqual(favorite(1, 100));
        expect(useFavoritesStore.getState().findRemoved(9)).toBeNull();
    });

    it("remembers a removed favorite, replacing the one with its id", () => {
        useFavoritesStore.getState().rememberRemoved(favorite(2, 200));
        useFavoritesStore.getState().rememberRemoved(favorite(1, 150));

        expect(removed()).toEqual([favorite(2, 200), favorite(1, 150)]);
    });

    it("forgets a removed favorite by its id, and changes nothing for a missing one", () => {
        useFavoritesStore.getState().forgetRemoved(9);
        useFavoritesStore.getState().forgetRemoved(1);

        expect(removed()).toEqual([]);
    });

    it("clears the removed favorites", () => {
        useFavoritesStore.getState().clearRemoved();

        expect(removed()).toEqual([]);
    });

    it.each([
        ["a new one at the top", favorite(4, 400), [4, 3, 1]],
        ["one put back with its old addedAt in its place", favorite(2, 200), [3, 2, 1]],
        ["the oldest at the end", favorite(0, 50), [3, 1, 0]],
    ])("adds %s, keeping the newest first", (_, added, expected) => {
        useFavoritesStore.getState().addFavorite(added);

        expect(ids()).toEqual(expected);
    });

    it("replaces a favorite added again with the same id, not adding it twice", () => {
        useFavoritesStore.getState().addFavorite(favorite(1, 100));

        expect(useFavoritesStore.getState().favorites).toEqual([favorite(3, 300), favorite(1, 100)]);
    });

    it("removes a favorite by its id, and changes nothing for a missing one", () => {
        useFavoritesStore.getState().removeFavorite(3);
        useFavoritesStore.getState().removeFavorite(9);

        expect(ids()).toEqual([1]);
    });

    it("finds a favorite by its id, and answers null for a show that is not one", () => {
        expect(useFavoritesStore.getState().findFavorite(1)).toEqual(favorite(1, 100));
        expect(useFavoritesStore.getState().findFavorite(9)).toBeNull();
    });
});
