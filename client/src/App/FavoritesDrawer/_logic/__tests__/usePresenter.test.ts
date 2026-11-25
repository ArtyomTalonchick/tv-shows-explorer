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

describe("FavoritesDrawer usePresenter", () => {
    it.each([
        ["a guest the way to sign in", null, [], [], "guest"],
        ["a user with nothing saved how to add a show", SESSION, [], [], "empty"],
        ["a user with favourites the list", SESSION, [DARK], [], "list"],
        ["the list while it keeps the row of the last show removed in it", SESSION, [], [DARK], "list"],
    ])("shows %s", (_, session, favorites, removed, content) => {
        useSessionStore.setState({ session });
        useFavoritesStore.setState({ favorites, removed });

        const { result } = renderHook(() => usePresenter());

        expect(result.current.content).toBe(content);
    });
});
