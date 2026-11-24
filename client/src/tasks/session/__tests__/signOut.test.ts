import type { Favorite, SessionResponse } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { signOut } from "../signOut";

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

describe("signOut", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("forgets the session and the user's favourites, and sends no request", () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        useSessionStore.setState({ session: SESSION });
        useFavoritesStore.setState({ favorites: [DARK] });

        signOut();

        expect(useSessionStore.getState().session).toBeNull();
        expect(useFavoritesStore.getState().favorites).toEqual([]);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
