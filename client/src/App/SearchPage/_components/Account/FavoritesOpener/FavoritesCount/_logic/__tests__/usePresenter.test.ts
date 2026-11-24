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

describe("FavoritesCount usePresenter", () => {
    it.each([
        ["a guest no badge", null, [], { isShown: false }],
        ["a user 0 in a muted badge", SESSION, [], { isShown: true, count: 0, tone: "zero" }],
        ["a user the number in the accent", SESSION, [DARK], { isShown: true, count: 1, tone: "some" }],
    ])("shows %s", (_, session, favorites, expected) => {
        useSessionStore.setState({ session });
        useFavoritesStore.setState({ favorites });

        const { result } = renderHook(() => usePresenter());

        expect(result.current).toMatchObject(expected);
    });
});
