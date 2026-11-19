import { act, renderHook, waitFor } from "@testing-library/react";
import type { Favorite } from "@tv-shows-explorer/shared";
import { toaster } from "@/lib/toast/toaster";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useFavoriteToggle } from "../useFavoriteToggle";

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

const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

// The options of the last toast: its action and its look.
const lastToast = () => vi.mocked(toaster.create).mock.lastCall?.[0];

describe("useFavoriteToggle", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
        vi.spyOn(toaster, "create").mockReturnValue("toast");
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("adds a show when the server answers, and says so", async () => {
        vi.stubGlobal("fetch", respond([DARK]));
        const { result } = renderHook(() => useFavoriteToggle(DARK));

        expect(result.current).toMatchObject({ pressed: false, label: "Add Dark to favourites" });

        act(() => result.current.toggle());

        expect(result.current).toMatchObject({ pressed: false, busy: true });
        await waitFor(() => expect(result.current).toMatchObject({ pressed: true, busy: false }));
        expect(result.current.label).toBe("Remove Dark from favourites");
        expect(lastToast()).toMatchObject({ meta: { icon: "bookmark", tone: "accent" }, action: undefined });
    });

    it("removes a show and puts it back in its old place on Undo", async () => {
        useFavoritesStore.setState({ favorites: [DARK] });
        const fetchMock = respond([]);
        vi.stubGlobal("fetch", fetchMock);
        const { result } = renderHook(() => useFavoriteToggle(DARK));

        act(() => result.current.toggle());

        await waitFor(() => expect(result.current.pressed).toBe(false));
        expect(fetchMock).toHaveBeenLastCalledWith(
            "/api/favorites/17861",
            expect.objectContaining({ method: "DELETE" }),
        );
        expect(lastToast()).toMatchObject({ meta: { icon: "bookmark", tone: "muted" }, action: { label: "Undo" } });

        fetchMock.mockResolvedValue(new Response(JSON.stringify([DARK])));
        act(() => lastToast()?.action?.onClick());

        await waitFor(() => expect(result.current.pressed).toBe(true));
        expect(fetchMock).toHaveBeenLastCalledWith(
            "/api/favorites/17861",
            expect.objectContaining({ method: "PUT", body: '{"addedAt":1763300000000}' }),
        );
    });

    it("leaves the bookmark as it was when the request fails, and says so", async () => {
        useFavoritesStore.setState({ favorites: [DARK] });
        vi.stubGlobal("fetch", respond({ error: "busy" }, 502));
        const { result } = renderHook(() => useFavoriteToggle(DARK));

        act(() => result.current.toggle());

        await waitFor(() => expect(result.current.busy).toBe(false));
        expect(result.current.pressed).toBe(true);
        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
        expect(lastToast()).toMatchObject({ type: "error", meta: { icon: "alert" } });
    });
});
