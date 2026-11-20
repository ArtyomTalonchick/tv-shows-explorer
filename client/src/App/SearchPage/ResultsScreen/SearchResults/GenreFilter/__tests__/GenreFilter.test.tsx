import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import type { ShowsPage } from "@tv-shows-explorer/shared";
import { system } from "@/lib/theme/system";
import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { GenreFilter } from "../GenreFilter";

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

describe("GenreFilter", () => {
    beforeEach(() => {
        clearSearch();
    });

    it("shows «All» first, then the genres of the shown answer, each with its count", () => {
        useSearchStore.setState({ value: "dark", query: "dark", answer: { query: "dark", data: PAGE, failed: false } });
        render(
            <ChakraProvider value={system}>
                <GenreFilter />
            </ChakraProvider>,
        );

        expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["All4", "Drama3", "Crime1"]);
        expect(screen.getByRole("group", { name: "Genre" })).toBeInTheDocument();
    });
});
