import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesDrawerStore } from "@/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "@/App/_stores/useFavoritesStore";
import { useSearchStore } from "@/stores/useSearchStore";
import { App } from "../App";
import { Provider } from "../Provider/Provider";

const DARK: Favorite = {
    id: 17861,
    name: "Dark",
    genres: ["Drama", "Science-Fiction"],
    premiered: "2017-12-01",
    ended: "2020-06-27",
    image: null,
    url: "https://www.tvmaze.com/shows/17861/dark",
    addedAt: 1763300000000,
};

const NOTHING_FOUND = { shows: [], genres: [], found: 0, genre: null, total: 0, page: 1, perPage: 3 };

// The app's server: the search finds nothing; the favorites start as `saved` and follow PUT and DELETE of DARK.
const stubServer = (saved: Favorite[] = []) => {
    let favorites = saved;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
        if (!url.startsWith("/api/favorites")) {
            return new Response(JSON.stringify(NOTHING_FOUND));
        }
        if (init?.method === "DELETE") {
            favorites = [];
            return new Response(null, { status: 204 });
        }
        if (init?.method === "PUT") {
            favorites = [DARK];
            return new Response(JSON.stringify(DARK));
        }
        return new Response(JSON.stringify(favorites));
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
};

const searchRequests = (fetchMock: ReturnType<typeof stubServer>) =>
    fetchMock.mock.calls.filter(([url]) => url.startsWith("/api/shows"));

const renderApp = (): void => {
    render(
        <Provider>
            <App />
        </Provider>,
    );
};

const searchbox = (): HTMLElement => screen.getByRole("searchbox", { name: "Search shows" });

describe("App", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
        useFavoritesDrawerStore.setState({ isOpen: false });
        useSearchStore.getState().clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("starts with the search field and the favourites button, and sends no search", async () => {
        const fetchMock = stubServer([DARK]);

        renderApp();

        expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(searchbox()).toHaveValue("");
        expect(searchbox()).not.toHaveFocus();
        expect(screen.queryByRole("region", { name: "Search results" })).not.toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "Favourites 1" })).toBeInTheDocument();
        expect(searchRequests(fetchMock)).toHaveLength(0);
    });

    it("lists the favourites in a drawer, removes one from its bookmark and puts it back on Undo", async () => {
        stubServer([DARK]);
        renderApp();

        fireEvent.click(await screen.findByRole("button", { name: "Favourites 1" }));
        const drawer = await screen.findByRole("dialog", { name: "Favourites 1" });
        expect(within(drawer).getByText("2017–2020 · Drama, Science-Fiction")).toBeInTheDocument();

        fireEvent.click(within(drawer).getByRole("button", { name: "Remove Dark from favourites", pressed: true }));

        expect(await within(drawer).findByText("No favourites yet")).toBeInTheDocument();
        expect(await screen.findByText(/Removed/)).toHaveTextContent("Removed Dark from favourites");

        fireEvent.click(screen.getByRole("button", { name: "Undo" }));

        expect(await within(drawer).findByText("Dark")).toBeInTheDocument();
        expect(screen.getByRole("dialog", { name: "Favourites 1" })).toBe(drawer);
    });

    it("opens the results screen on a tap with its field focused, without focusing the hero field", async () => {
        stubServer();
        renderApp();

        const notCancelled = fireEvent.touchEnd(searchbox());

        expect(notCancelled).toBe(false);
        expect(await screen.findByRole("heading", { name: "Search for a show" })).toBeInTheDocument();
        expect(searchbox()).toHaveFocus();
    });

    it("opens the results screen on focus, stays there on Clear and goes back to the hero from the logo", async () => {
        stubServer();
        renderApp();

        act(() => searchbox().focus());

        expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Search for a show" })).toBeInTheDocument();
        expect(searchbox()).toHaveFocus();

        fireEvent.change(searchbox(), { target: { value: "dark" } });
        // Cleared after the answer, so no request is left running.
        await screen.findByText(/Nothing found/);
        fireEvent.click(screen.getByLabelText("Clear search", { selector: "button" }));

        expect(searchbox()).toHaveValue("");
        expect(searchbox()).toHaveFocus();
        expect(screen.getByRole("heading", { name: "Search for a show" })).toBeInTheDocument();

        fireEvent.change(searchbox(), { target: { value: "dark" } });
        fireEvent.click(screen.getByRole("button", { name: "tv/explorer — back to start" }));

        expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(searchbox()).toHaveValue("");
    });
});
