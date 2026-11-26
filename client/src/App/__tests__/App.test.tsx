import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesDrawerStore } from "~/App/_stores/useFavoritesDrawerStore";
import { toaster } from "~/lib/toast/toaster";
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

// The app's server: its health answers as up, or with a network error unless `isUp`; the search finds nothing, a
// sign-in, a sign-up and a refresh succeed; the favorites start as `saved` and follow PUT and DELETE of DARK.
const stubServer = (saved: Favorite[] = [], { isUp = true } = {}) => {
    let favorites = saved;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
        if (url === "/api/health" && !isUp) {
            throw new TypeError("Failed to fetch");
        }
        if (url === "/api/health") {
            return new Response(JSON.stringify({ status: "ok" }));
        }
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
        vi.restoreAllMocks();
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

    it("wakes the server once on start", () => {
        const fetchMock = stubServer();

        renderApp();

        expect(fetchMock.mock.calls.filter(([url]) => url === "/api/health")).toHaveLength(1);
    });

    it("shows nothing when the server does not answer the wake-up, and the search still works", async () => {
        stubServer([], { isUp: false });
        vi.spyOn(toaster, "create");
        renderApp();

        act(() => searchbox().focus());
        fireEvent.change(searchbox(), { target: { value: "dark" } });

        expect(await screen.findByText(/Nothing found/)).toBeInTheDocument();
        expect(toaster.create).not.toHaveBeenCalled();

        // Back to the hero, so the next test starts there.
        fireEvent.click(screen.getByRole("button", { name: "tv/explorer — back to start" }));
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

    it("shows a guest «Sign in», which leads to the sign-in page, and favourites with no counter, without asking for them", () => {
        const fetchMock = stubServer([DARK]);
        renderApp();

        expect(screen.queryByRole("button", { name: "anna@example.com" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /^Favourites$/ })).toBeInTheDocument();
        expect(fetchMock.mock.calls.filter(([url]) => url.startsWith("/api/favorites"))).toHaveLength(0);

        fireEvent.click(screen.getByRole("link", { name: "Sign in" }));

        expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
        expect(window.location.pathname).toBe("/sign-in");
    });

    it("asks a guest to sign in from the favourites drawer, and closes it on the way to the sign-in page", async () => {
        stubServer();
        renderApp();

        fireEvent.click(screen.getByRole("button", { name: /^Favourites$/ }));
        const drawer = await screen.findByRole("dialog", { name: "Favourites" });
        expect(within(drawer).getByRole("heading", { name: "Sign in to keep favourites" })).toBeInTheDocument();
        expect(within(drawer).getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/sign-up");

        fireEvent.click(within(drawer).getByRole("link", { name: "Sign in" }));

        expect(await screen.findByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
        expect(useFavoritesDrawerStore.getState().isOpen).toBe(false);
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

    it("lists the favourites in a drawer, keeps a show removed there in its place and puts it back", async () => {
        stubServer([DARK]);
        useSessionStore.setState({ session: SESSION });
        renderApp();

        fireEvent.click(await screen.findByRole("button", { name: "Favourites 1" }));
        const drawer = await screen.findByRole("dialog", { name: "Favourites 1" });
        expect(within(drawer).getByText("2017–2020 · Drama, Science-Fiction")).toBeInTheDocument();

        fireEvent.click(within(drawer).getByRole("button", { name: "Remove Dark from favourites", pressed: true }));

        expect(await screen.findByRole("dialog", { name: "Favourites 0" })).toBe(drawer);
        expect(within(drawer).getByText("Dark")).toBeInTheDocument();
        expect(within(drawer).queryByText("No favourites yet")).not.toBeInTheDocument();
        expect(screen.queryByText(/Removed Dark from favourites/)).not.toBeInTheDocument();

        fireEvent.click(within(drawer).getByRole("button", { name: /Dark/, pressed: false }));

        expect(await screen.findByRole("dialog", { name: "Favourites 1" })).toBe(drawer);
        expect(
            within(drawer).getByRole("button", { name: "Remove Dark from favourites", pressed: true }),
        ).toBeVisible();
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
