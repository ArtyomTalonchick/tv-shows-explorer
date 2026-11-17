import type { TouchEvent } from "react";

export type SearchHeroInputProps = {
    query: string;
    onQueryChange: (query: string) => void;
    // Focusing the field opens the results screen.
    onOpen: () => void;
};

type UsePresenterResult = SearchHeroInputProps & {
    // A tap focuses the field itself, without the scroll iOS makes to bring a centred field above the keyboard.
    handleTouchEnd: (event: TouchEvent<HTMLInputElement>) => void;
};

export const usePresenter = ({ query, onQueryChange, onOpen }: SearchHeroInputProps): UsePresenterResult => {
    const handleTouchEnd = (event: TouchEvent<HTMLInputElement>): void => {
        event.preventDefault();
        // The focus is set inside the tap, so iOS opens the keyboard; onFocus then plays the transition.
        event.currentTarget.focus({ preventScroll: true });
    };

    return { query, onQueryChange, onOpen, handleTouchEnd };
};
