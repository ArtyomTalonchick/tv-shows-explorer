import { renderHook } from "@testing-library/react";
import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { usePresenter } from "../usePresenter";

const DARK: Favorite = {
    id: 17861,
    name: "Dark",
    genres: ["Drama"],
    premiered: "2017-12-01",
    ended: "2020-06-27",
    image: null,
    url: "https://www.tvmaze.com/shows/17861/dark",
    addedAt: 1763300000000,
};

describe("FavoritesTitle usePresenter", () => {
    it.each([
        ["0 for an empty list", [], { count: 0 }],
        ["the number of favourites", [DARK], { count: 1 }],
    ])("gives %s", (_, favorites, expected) => {
        useFavoritesStore.setState({ favorites });

        const { result } = renderHook(() => usePresenter());

        expect(result.current).toEqual(expected);
    });
});
