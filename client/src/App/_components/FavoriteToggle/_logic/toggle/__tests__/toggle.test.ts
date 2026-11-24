import type { Favorite, SessionResponse } from "@tv-shows-explorer/shared";
import { toaster } from "~/lib/toast/toaster";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { toggle } from "../toggle";

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

const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

// The options of the last toast: its action and its look.
const lastToast = () => vi.mocked(toaster.create).mock.lastCall?.[0];

describe("toggle", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
        useSessionStore.setState({ session: SESSION });
        vi.spyOn(toaster, "create").mockReturnValue("toast");
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("adds a show at once, and says so", async () => {
        vi.stubGlobal("fetch", respond(DARK));

        const press = toggle(DARK);

        expect(useFavoritesStore.getState().favorites).toHaveLength(1);
        expect(lastToast()).toMatchObject({ meta: { icon: "bookmark", tone: "accent" }, action: undefined });
        await press;
        expect(toaster.create).toHaveBeenCalledTimes(1);
    });

    it("removes a show at once, and offers Undo that puts it back in its old place", async () => {
        useFavoritesStore.setState({ favorites: [DARK] });
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
        vi.stubGlobal("fetch", fetchMock);

        await toggle(DARK);

        expect(useFavoritesStore.getState().favorites).toEqual([]);
        expect(lastToast()).toMatchObject({ meta: { icon: "bookmark", tone: "muted" }, action: { label: "Undo" } });

        fetchMock.mockResolvedValue(new Response(JSON.stringify(DARK)));
        lastToast()?.action?.onClick();

        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
    });

    it("says so when the request fails, once the bookmark is back", async () => {
        useFavoritesStore.setState({ favorites: [DARK] });
        vi.stubGlobal("fetch", respond({ error: "busy" }, 502));

        await toggle(DARK);

        expect(useFavoritesStore.getState().favorites).toEqual([DARK]);
        expect(lastToast()).toMatchObject({ type: "error", meta: { icon: "alert" } });
    });

    it("sends nothing for a guest, and offers to sign in", async () => {
        useSessionStore.setState({ session: null });
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        await toggle(DARK);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(useFavoritesStore.getState().favorites).toEqual([]);
        expect(toaster.create).toHaveBeenCalledTimes(1);
        expect(lastToast()).toMatchObject({
            type: "info",
            action: undefined,
            meta: { icon: "bookmark", tone: "muted", link: { label: "Sign in", to: "/sign-in" } },
        });
    });
});
