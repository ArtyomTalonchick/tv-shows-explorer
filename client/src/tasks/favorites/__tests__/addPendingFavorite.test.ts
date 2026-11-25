import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { addPendingFavorite } from "../addPendingFavorite";

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

describe("addPendingFavorite", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [], removed: [] });
        useSessionStore.setState({
            session: { accessToken: "access", refreshToken: "refresh", user: { id: "u1", email: "anna@example.com" } },
        });
        vi.spyOn(Date, "now").mockReturnValue(DARK.addedAt);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("adds the show the guest bookmarked", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(DARK)));
        vi.stubGlobal("fetch", fetchMock);

        await addPendingFavorite(DARK);

        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
        expect(fetchMock.mock.lastCall?.[1]).toMatchObject({ method: "PUT" });
    });

    it.each([
        ["no show", null],
        ["a show already saved", { ...DARK, addedAt: 1 }],
    ])("changes nothing and sends nothing for %s", async (_, pending) => {
        const saved = { ...DARK, addedAt: 1 };
        useFavoritesStore.setState({ favorites: [saved] });
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        await addPendingFavorite(pending);

        expect(useFavoritesStore.getState().favorites).toEqual([saved]);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
