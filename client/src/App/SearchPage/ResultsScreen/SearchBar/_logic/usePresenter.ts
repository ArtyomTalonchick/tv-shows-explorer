import type { RefObject } from "react";
import type { SearchInputProps } from "@/lib/components/SearchInput/SearchInput";
import { clearSearch } from "@/tasks/search/clearSearch";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { goHome } from "./goHome";

export type SearchBarProps = {
    // The field, for the screen that gives it the focus back after a clear.
    fieldRef: RefObject<HTMLInputElement | null>;
    // The × button of the field, while it holds text.
    onClear: () => void;
};

type UsePresenterResult = SearchBarProps & {
    // Hidden while the screens swap.
    caretColor: SearchInputProps["caretColor"];
    // The logo: back to the start screen, with the search cleared and the request on its way cancelled.
    onHome: () => void;
};

export const usePresenter = ({ fieldRef, onClear }: SearchBarProps): UsePresenterResult => {
    const isSwapping = useScreenStore((state) => state.isSwapping);

    return {
        fieldRef,
        onClear,
        caretColor: isSwapping ? "transparent" : undefined,
        onHome: () => void goHome(() => clearSearch()),
    };
};
