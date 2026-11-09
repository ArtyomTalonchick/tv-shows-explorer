import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { system } from "@/lib/theme/system";
import { GenreFilter } from "../GenreFilter";

const GENRES = [
  { genre: "Drama", count: 3 },
  { genre: "Crime", count: 1 },
];

const renderFilter = (selected: string | null, onSelect = vi.fn()) => {
  render(
    <ChakraProvider value={system}>
      <GenreFilter genres={GENRES} total={4} selected={selected} onSelect={onSelect} />
    </ChakraProvider>,
  );
  return onSelect;
};

describe("GenreFilter", () => {
  it("shows «All» first, then the genres, each with its count", () => {
    renderFilter(null);

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["All4", "Drama3", "Crime1"]);
    expect(screen.getByRole("group", { name: "Genre" })).toBeInTheDocument();
  });

  it("marks «All» as pressed with no genre selected", () => {
    renderFilter(null);

    expect(screen.getByRole("button", { name: "All 4" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Drama 3" })).toHaveAttribute("aria-pressed", "false");
  });

  it("marks the selected genre as pressed", () => {
    renderFilter("Drama");

    expect(screen.getByRole("button", { name: "Drama 3" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All 4" })).toHaveAttribute("aria-pressed", "false");
  });

  it("asks for a genre and for all the shows", () => {
    const onSelect = renderFilter("Drama");

    fireEvent.click(screen.getByRole("button", { name: "Crime 1" }));
    fireEvent.click(screen.getByRole("button", { name: "All 4" }));

    expect(onSelect.mock.calls).toEqual([["Crime"], [null]]);
  });
});
