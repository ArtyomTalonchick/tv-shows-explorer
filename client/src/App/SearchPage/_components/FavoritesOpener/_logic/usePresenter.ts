import type { HTMLChakraProps } from "@chakra-ui/react";
import { useFavoritesDrawerStore } from "@/App/_stores/useFavoritesDrawerStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

const COUNT_STYLES = {
    zero: { bg: "bg.muted", color: "fg.muted" },
    some: { bg: "accent.solid", color: "accent.contrast" },
} satisfies Record<"zero" | "some", HTMLChakraProps<"span">>;

type UsePresenterResult = {
    // The number of favourites; 0 is shown too, in a muted badge.
    count: number;
    countStyles: HTMLChakraProps<"span">;
    open: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const count = useFavoritesStore((state) => state.favorites.length);
    const setIsOpen = useFavoritesDrawerStore((state) => state.setIsOpen);

    return {
        count,
        countStyles: COUNT_STYLES[count === 0 ? "zero" : "some"],
        open: () => setIsOpen(true),
    };
};
