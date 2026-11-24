import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { useSessionStore } from "~/stores/useSessionStore";
import { clearSearch } from "~/tasks/search/clearSearch";
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

const SESSION = { accessToken: "access", refreshToken: "refresh", user: { id: "u1", email: "anna@example.com" } };

const NOTHING_FOUND = { shows: [], genres: [], found: 0, genre: null, total: 0, page: 1, perPage: 3 };

// The app's server: the search finds nothing, a sign-in, a sign-up and a refresh succeed; the favorites start as
// `saved` and follow PUT and DELETE of DARK.
const stubServer = (saved: Favorite[] = []) => {
    let favorites = saved;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
        if (["/api/session", "/api/users", "/api/session/refresh"].includes(url)) {
            return new Response(JSON.stringify(SESSION));
        }
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

// Opens the app at `path`, as a direct visit to that address.
const renderApp = (path = "/"): void => {
    window.history.replaceState(null, "", path);
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
        useSessionStore.setState({ session: null });
        clearSearch();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("starts with the search field and the favourites button, and sends no search", async () => {
        const fetchMock = stubServer([DARK]);
        useSessionStore.setState({ session: SESSION });

        renderApp();

        expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(searchbox()).toHaveValue("");
        expect(searchbox()).not.toHaveFocus();
        expect(screen.queryByRole("region", { name: "Search results" })).not.toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "Favourites 1" })).toBeInTheDocument();
        expect(searchRequests(fetchMock)).toHaveLength(0);
    });

    it.each([
        ["/sign-in", "Sign in"],
        ["/sign-up", "Create an account"],
    ])("opens %s on a direct visit, with the logo that leads back to the search", (path, title) => {
        stubServer();

        renderApp(path);

        expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
        expect(window.location.pathname).toBe(path);

        fireEvent.click(screen.getByRole("link", { name: "tv/explorer — back to start" }));

        expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/");
    });

    it("leads from the sign-in page to the sign-up page and back", () => {
        stubServer();
        renderApp("/sign-in");

        fireEvent.click(screen.getByRole("link", { name: "Sign up" }));

        expect(screen.getByRole("heading", { level: 1, name: "Create an account" })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/sign-up");

        fireEvent.click(screen.getByRole("link", { name: "Sign in" }));

        expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/sign-in");
    });

    it("signs the user in, loads their favourites and leads to the search page", async () => {
        stubServer([DARK]);
        renderApp("/sign-in");

        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "anna@example.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "severance" } });
        fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

        expect(await screen.findByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/");
        expect(screen.getByRole("button", { name: "Favourites 1" })).toBeInTheDocument();
    });

    it("signs the user up and leads to the search page", async () => {
        stubServer();
        renderApp("/sign-up");

        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "anna@example.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "severance" } });
        fireEvent.click(screen.getByRole("button", { name: "Create account" }));

        expect(await screen.findByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/");
    });

    it.each(["/sign-in", "/sign-up"])("leads a signed-in user from %s to the search page", (path) => {
        stubServer();
        useSessionStore.setState({ session: SESSION });

        renderApp(path);

        expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/");
    });

    it("shows a guest «Sign in», which leads to the sign-in page, and no favourites, without asking for them", () => {
        const fetchMock = stubServer([DARK]);
        renderApp();

        expect(screen.queryByRole("button", { name: "anna@example.com" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Favourites 0" })).toBeInTheDocument();
        expect(fetchMock.mock.calls.filter(([url]) => url.startsWith("/api/favorites"))).toHaveLength(0);

        fireEvent.click(screen.getByRole("link", { name: "Sign in" }));

        expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/sign-in");
    });

    it("shows a signed-in user in the header, and signing out makes the page a guest's", async () => {
        stubServer();
        useSessionStore.setState({ session: SESSION });
        renderApp();

        expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "anna@example.com" }));
        fireEvent.click(await screen.findByRole("menuitem", { name: "Sign out" }));

        expect(await screen.findByRole("link", { name: "Sign in" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "anna@example.com" })).not.toBeInTheDocument();
    });

    it("leads an unknown address to the search page", () => {
        stubServer();

        renderApp("/nowhere");

        expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/");
    });

    it("lists the favourites in a drawer, removes one from its bookmark and puts it back on Undo", async () => {
        stubServer([DARK]);
        useSessionStore.setState({ session: SESSION });
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
