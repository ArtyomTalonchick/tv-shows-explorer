import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ShowsPage } from "@tv-shows-explorer/shared";
import { system } from "@/lib/theme/system";
import { showToast } from "@/lib/toast/showToast";
import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { GenreFilter } from "../GenreFilter";
import { selectGenre } from "../_logic/_tasks/selectGenre";

vi.mock("../_logic/_tasks/selectGenre", () => ({ selectGenre: vi.fn(async () => {}) }));
vi.mock("@/lib/toast/showToast", () => ({ showToast: vi.fn() }));

const PAGE: ShowsPage = {
    shows: [],
    genres: [
        { genre: "Drama", count: 3 },
        { genre: "Crime", count: 1 },
    ],
    found: 4,
    genre: null,
    total: 4,
    page: 1,
    perPage: 3,
};

const renderFilter = (genre: string | null, query = "dark"): void => {
    useSearchStore.setState({ value: query, query, genre, answer: { query: "dark", data: PAGE, failed: false } });
    render(
        <ChakraProvider value={system}>
            <GenreFilter />
        </ChakraProvider>,
    );
};

const isPressed = (name: string): string | null => screen.getByRole("button", { name }).getAttribute("aria-pressed");

describe("GenreFilter", () => {
    beforeEach(() => {
        clearSearch();
        vi.mocked(selectGenre).mockClear();
    });

    it("shows «All» first, then the genres of the shown answer, each with its count", () => {
        renderFilter(null);

        expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["All4", "Drama3", "Crime1"]);
        expect(screen.getByRole("group", { name: "Genre" })).toBeInTheDocument();
    });

    it("marks «All» with no genre selected, and the asked genre at once", () => {
        renderFilter("Drama");

        expect(isPressed("Drama 3")).toBe("true");
        expect(isPressed("All 4")).toBe("false");
    });

    it("keeps the genre of the shown answer marked while a new query waits and loads", () => {
        renderFilter("Drama", "dark s");

        expect(isPressed("All 4")).toBe("true");
    });

    it("asks for a genre and for all the shows", () => {
        renderFilter("Drama");

        fireEvent.click(screen.getByRole("button", { name: "Crime 1" }));
        fireEvent.click(screen.getByRole("button", { name: "All 4" }));

        expect(vi.mocked(selectGenre).mock.calls).toEqual([["Crime"], [null]]);
    });

    it("says so in a toast when the genre fails to load", async () => {
        vi.mocked(selectGenre).mockRejectedValueOnce(new Error("502"));
        renderFilter(null);

        fireEvent.click(screen.getByRole("button", { name: "Crime 1" }));

        await waitFor(() => expect(showToast).toHaveBeenCalledWith(expect.objectContaining({ urgent: true })));
    });
});
