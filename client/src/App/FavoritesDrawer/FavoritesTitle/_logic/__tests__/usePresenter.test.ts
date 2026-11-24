import { renderHook } from "@testing-library/react";
import type { Favorite, SessionResponse } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { usePresenter } from "../usePresenter";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

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
        ["a guest no count", null, [], { hasCount: false }],
        ["a user 0 for an empty list", SESSION, [], { hasCount: true, count: 0 }],
        ["a user the number of favourites", SESSION, [DARK], { hasCount: true, count: 1 }],
    ])("gives %s", (_, session, favorites, expected) => {
        useSessionStore.setState({ session });
        useFavoritesStore.setState({ favorites });

        const { result } = renderHook(() => usePresenter());

        expect(result.current).toMatchObject(expected);
    });
});
