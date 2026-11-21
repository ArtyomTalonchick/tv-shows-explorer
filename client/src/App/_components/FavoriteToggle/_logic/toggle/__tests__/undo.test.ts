import type { Favorite } from "@tv-shows-explorer/shared";
import { toaster } from "~/lib/toast/toaster";
import { useFavoritesStore } from "~/App/_stores/useFavoritesStore";
import { undo } from "../undo";

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

const OLDER: Favorite = { ...DARK, id: 1, name: "Older", addedAt: 1 };

// The options of the last toast: its action and its look.
const lastToast = () => vi.mocked(toaster.create).mock.lastCall?.[0];

describe("undo", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [OLDER] });
        vi.spyOn(toaster, "create").mockReturnValue("toast");
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("puts the removed show back in its old place, and says so", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(DARK)));
        vi.stubGlobal("fetch", fetchMock);

        await undo(DARK);

        expect(useFavoritesStore.getState().favorites).toEqual([DARK, OLDER]);
        expect(lastToast()).toMatchObject({ meta: { icon: "bookmark", tone: "accent" } });
        expect(fetchMock).toHaveBeenCalledWith(
            "/api/favorites/17861",
            expect.objectContaining({ method: "PUT", body: '{"addedAt":1763300000000}' }),
        );
    });

    it("takes the show out again and says so when the request fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "busy" }), { status: 502 })),
        );

        await undo(DARK);

        expect(useFavoritesStore.getState().favorites).toEqual([OLDER]);
        expect(lastToast()).toMatchObject({ type: "error", meta: { icon: "alert" } });
    });
});
