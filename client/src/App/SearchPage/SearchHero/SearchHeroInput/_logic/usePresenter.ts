import type { TouchEvent } from "react";
import { useScreenSwap } from "@/App/SearchPage/_logic/useScreenSwap/useScreenSwap";
import { useSearchQuery } from "@/App/SearchPage/_logic/useSearchQuery";

type UsePresenterResult = {
    query: string;
    onQueryChange: (query: string) => void;
    // Focusing the field — a click, Tab — opens the results screen.
    onOpen: () => void;
    // A tap opens the results screen itself, once the keyboard is open, and leaves the field unfocused: the browser's
    // own focus would scroll a centred field above the keyboard.
    handleTouchEnd: (event: TouchEvent<HTMLInputElement>) => void;
};

export const usePresenter = (): UsePresenterResult => {
    const { value, handleChange } = useSearchQuery();
    const { open } = useScreenSwap();

    const handleOpen = (): void => {
        void open({ fromTap: false });
    };

    const handleTouchEnd = (event: TouchEvent<HTMLInputElement>): void => {
        event.preventDefault();
        void open({ fromTap: true });
    };

    return { query: value, onQueryChange: handleChange, onOpen: handleOpen, handleTouchEnd };
};
