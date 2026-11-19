import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Favorite } from "@tv-shows-explorer/shared";
import { system } from "@/lib/theme/system";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { FavoriteToggle } from "../FavoriteToggle";

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

const renderToggle = () =>
    render(
        <ChakraProvider value={system}>
            <FavoriteToggle show={DARK} />
        </ChakraProvider>,
    );

describe("FavoriteToggle", () => {
    beforeEach(() => {
        useFavoritesStore.setState({ favorites: [] });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("is a toggle button named by what a press does", () => {
        useFavoritesStore.setState({ favorites: [DARK] });
        const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal("fetch", fetchMock);
        renderToggle();

        const toggle = screen.getByRole("button", { name: "Remove Dark from favourites", pressed: true });
        fireEvent.click(toggle);

        expect(fetchMock).toHaveBeenCalledWith("/api/favorites/17861", expect.objectContaining({ method: "DELETE" }));
    });

    it("does nothing on a press while busy, and keeps the focus", () => {
        const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
        vi.stubGlobal("fetch", fetchMock);
        renderToggle();

        const toggle = screen.getByRole("button", { name: "Add Dark to favourites", pressed: false });
        fireEvent.click(toggle);
        fireEvent.click(toggle);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(toggle).toHaveAttribute("aria-busy", "true");
        expect(toggle).toBeEnabled();
    });
});
