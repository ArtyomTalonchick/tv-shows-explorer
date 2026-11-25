import { renderHook } from "@testing-library/react";
import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useRemovedFavoritesStore } from "~/App/_stores/useRemovedFavoritesStore";
import { usePresenter } from "../usePresenter";

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

const ids = (): number[] => renderHook(() => usePresenter()).result.current.favorites.map(({ id }) => id);

describe("FavoritesList usePresenter", () => {
    it("keeps the row of a removed show in its place", () => {
        useFavoritesStore.setState({ favorites: [favorite(3, 300), favorite(1, 100)] });
        useRemovedFavoritesStore.setState({ removed: [favorite(2, 200)] });

        expect(ids()).toEqual([3, 2, 1]);
    });

    it("shows a removed show put back once", () => {
        useFavoritesStore.setState({ favorites: [favorite(2, 200)] });
        useRemovedFavoritesStore.setState({ removed: [favorite(2, 200)] });

        expect(ids()).toEqual([2]);
    });
});
