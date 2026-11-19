import type { TouchEvent } from "react";
import { openResults } from "./openResults";

type UsePresenterResult = {
    // Focusing the field — a click, Tab — opens the results screen.
    onOpen: () => void;
    // A tap opens the results screen itself, once the keyboard is open, and leaves the field unfocused: the browser's
    // own focus would scroll a centred field above the keyboard.
    handleTouchEnd: (event: TouchEvent<HTMLInputElement>) => void;
};

export const usePresenter = (): UsePresenterResult => {
    const handleOpen = (): void => {
        void openResults({ fromTap: false });
    };

    const handleTouchEnd = (event: TouchEvent<HTMLInputElement>): void => {
        event.preventDefault();
        void openResults({ fromTap: true });
    };

    return { onOpen: handleOpen, handleTouchEnd };
};
