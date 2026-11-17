import type { TouchEvent } from "react";
import { useScreenSwap } from "@/SearchPage/_logic/useScreenSwap/useScreenSwap";
import { useSearchQuery } from "@/SearchPage/_logic/useSearchQuery";

type UsePresenterResult = {
    query: string;
    onQueryChange: (query: string) => void;
    // Focusing the field opens the results screen.
    onOpen: () => void;
    // A tap focuses the field itself, without the scroll iOS makes to bring a centred field above the keyboard.
    handleTouchEnd: (event: TouchEvent<HTMLInputElement>) => void;
};

export const usePresenter = (): UsePresenterResult => {
    const { value, handleChange } = useSearchQuery();
    const { open } = useScreenSwap();

    const handleTouchEnd = (event: TouchEvent<HTMLInputElement>): void => {
        event.preventDefault();
        // The focus is set inside the tap, so iOS opens the keyboard; onFocus then plays the transition.
        event.currentTarget.focus({ preventScroll: true });
    };

    return { query: value, onQueryChange: handleChange, onOpen: open, handleTouchEnd };
};
