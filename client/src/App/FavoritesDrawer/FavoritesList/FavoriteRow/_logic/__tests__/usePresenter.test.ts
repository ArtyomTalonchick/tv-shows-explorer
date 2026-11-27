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

describe("FavoriteRow usePresenter", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
    });

    it("shows a favourite as saved", () => {
        useFavoritesStore.setState({ favorites: [DARK] });
        const { result } = renderHook(() => usePresenter({ favorite: DARK }));

        expect(result.current).toMatchObject({
            state: "saved",
            isRemoved: false,
            name: "Dark",
            href: DARK.url,
            imageSrc: undefined,
        });
    });

    it("shows a show no longer in the favourites as removed", () => {
        const { result } = renderHook(() => usePresenter({ favorite: DARK }));

        expect(result.current).toMatchObject({ state: "removed", isRemoved: true });
    });
});
