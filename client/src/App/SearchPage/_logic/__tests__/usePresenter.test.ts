import type { Show } from "@tv-shows-explorer/shared";
import { act, renderHook } from "@testing-library/react";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useScreenStore } from "../../_stores/useScreenStore";
import { usePresenter } from "../usePresenter";

const DARK: Omit<Show, "rating"> = {
    id: 17861,
    name: "Dark",
    genres: ["Drama"],
    premiered: "2017-12-01",
    ended: "2020-06-27",
    image: null,
    url: "https://www.tvmaze.com/shows/17861/dark",
};

describe("SearchPage usePresenter", () => {
    beforeEach(() => {
        useScreenStore.setState({ isStart: true, isSwapping: false });
    });

    it("starts on the hero, and shows the results screen once the screen store says so", () => {
        const { result } = renderHook(() => usePresenter());
        expect(result.current.isStart).toBe(true);

        act(() => useScreenStore.setState({ isStart: false }));

        expect(result.current.isStart).toBe(false);
    });

    it("forgets the show a guest bookmarked, once the guest is back on the search", () => {
        useFavoritesStore.setState({ pending: DARK });

        renderHook(() => usePresenter());

        expect(useFavoritesStore.getState().pending).toBeNull();
    });
});
