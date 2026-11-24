import { act, renderHook } from "@testing-library/react";
import type { Favorite, SessionResponse } from "@tv-shows-explorer/shared";
import { toaster } from "~/lib/toast/toaster";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
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

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

describe("FavoriteToggle usePresenter", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
        useSessionStore.setState({ session: SESSION });
        vi.spyOn(toaster, "create").mockReturnValue("toast");
        vi.stubGlobal(
            "fetch",
            vi.fn(() => new Promise<Response>(() => {})),
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("names what a press does, on a poster by default", () => {
        const { result } = renderHook(() => usePresenter({ show: DARK }));

        expect(result.current).toMatchObject({ pressed: false, label: "Add Dark to favourites", variant: "poster" });
    });

    it("follows the store, and a press changes it at once", () => {
        useFavoritesStore.setState({ favorites: [DARK] });
        const { result } = renderHook(() => usePresenter({ show: DARK, variant: "plain" }));

        expect(result.current).toMatchObject({ pressed: true, label: "Remove Dark from favourites", variant: "plain" });

        act(() => result.current.handleClick());

        expect(result.current).toMatchObject({ pressed: false, label: "Add Dark to favourites" });
    });
});
