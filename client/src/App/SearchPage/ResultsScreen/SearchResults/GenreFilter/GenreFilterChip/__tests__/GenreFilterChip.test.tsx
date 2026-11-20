import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ShowsPage } from "@tv-shows-explorer/shared";
import { system } from "@/lib/theme/system";
import { showToast } from "@/lib/toast/showToast";
import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { GenreFilterChip } from "../GenreFilterChip";
import { selectGenre } from "../_logic/_tasks/selectGenre";

vi.mock("../_logic/_tasks/selectGenre", () => ({ selectGenre: vi.fn(async () => {}) }));
vi.mock("@/lib/toast/showToast", () => ({ showToast: vi.fn() }));

const PAGE: ShowsPage = { shows: [], genres: [], found: 4, genre: null, total: 4, page: 1, perPage: 3 };

// «All» and «Drama», with `genre` asked for the query `query`; the shown answer is of «dark».
const renderChips = (genre: string | null, query = "dark"): void => {
    useSearchStore.setState({ value: query, query, genre, answer: { query: "dark", data: PAGE, failed: false } });
    render(
        <ChakraProvider value={system}>
            <GenreFilterChip genre={null} count={4} />
            <GenreFilterChip genre="Drama" count={3} />
        </ChakraProvider>,
    );
};

const isPressed = (name: string): string | null => screen.getByRole("button", { name }).getAttribute("aria-pressed");

describe("GenreFilterChip", () => {
    beforeEach(() => {
        clearSearch();
        vi.mocked(selectGenre).mockClear();
    });

    it("marks «All» with no genre selected", () => {
        renderChips(null);

        expect(isPressed("All 4")).toBe("true");
        expect(isPressed("Drama 3")).toBe("false");
    });

    it("marks the asked genre at once", () => {
        renderChips("Drama");

        expect(isPressed("Drama 3")).toBe("true");
        expect(isPressed("All 4")).toBe("false");
    });

    it("keeps the genre of the shown answer marked while a new query waits and loads", () => {
        renderChips("Drama", "dark s");

        expect(isPressed("All 4")).toBe("true");
    });

    it("asks for its genre, and «All» for all the shows", () => {
        renderChips("Drama");

        fireEvent.click(screen.getByRole("button", { name: "Drama 3" }));
        fireEvent.click(screen.getByRole("button", { name: "All 4" }));

        expect(vi.mocked(selectGenre).mock.calls).toEqual([["Drama"], [null]]);
    });

    it("says so in a toast when the genre fails to load", async () => {
        vi.mocked(selectGenre).mockRejectedValueOnce(new Error("502"));
        renderChips(null);

        fireEvent.click(screen.getByRole("button", { name: "Drama 3" }));

        await waitFor(() => expect(showToast).toHaveBeenCalledWith(expect.objectContaining({ urgent: true })));
    });
});
