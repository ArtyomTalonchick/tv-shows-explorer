import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { system } from "@/lib/theme/system";
import { FavoriteToggle } from "../FavoriteToggle";

describe("FavoriteToggle", () => {
    it("is a toggle button named by what a press does", () => {
        const onClick = vi.fn();
        render(
            <ChakraProvider value={system}>
                <FavoriteToggle pressed label="Remove Dark from favourites" onClick={onClick} />
            </ChakraProvider>,
        );

        const toggle = screen.getByRole("button", { name: "Remove Dark from favourites", pressed: true });
        fireEvent.click(toggle);

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does nothing on a press while busy, and keeps the focus", () => {
        const onClick = vi.fn();
        render(
            <ChakraProvider value={system}>
                <FavoriteToggle pressed={false} busy label="Add Dark to favourites" onClick={onClick} />
            </ChakraProvider>,
        );

        const toggle = screen.getByRole("button", { name: "Add Dark to favourites" });
        fireEvent.click(toggle);

        expect(onClick).not.toHaveBeenCalled();
        expect(toggle).toHaveAttribute("aria-busy", "true");
        expect(toggle).toBeEnabled();
    });
});
