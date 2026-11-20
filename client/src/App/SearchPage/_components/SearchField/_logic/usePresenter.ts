import { useMemo, useRef, type RefObject } from "react";
import { debounce } from "@/lib/debounce/debounce";
import type { SearchInputProps } from "@/lib/components/SearchInput/SearchInput";
import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { SEARCH_FIELD_ID } from "@/App/SearchPage/constants";
import { changeQuery } from "./_tasks/changeQuery";
import { searchQuery } from "./_tasks/searchQuery";

// The props of the field (`size`, `onFocus`, `autoFocus`, `caretColor`…) go to it as they are. What it holds, its
// name, its placeholder, its id and its × button are the search's own; `clearable` shows the × while it holds text.
export type SearchFieldProps = Omit<
    SearchInputProps,
    "value" | "onChange" | "onClear" | "label" | "placeholder" | "id" | "ref"
> & {
    clearable?: boolean;
};

// The search goes once typing has stopped for this long.
const SEARCH_DEBOUNCE_MS = 400;

type UsePresenterResult = {
    inputProps: Omit<SearchFieldProps, "clearable">;
    id: string;
    ref: RefObject<HTMLInputElement | null>;
    value: string;
    handleChange: (value: string) => void;
    // The × button: empties the field, forgets the search and gives the field the focus back.
    handleClear: (() => void) | undefined;
};

export const usePresenter = ({ clearable = false, ...inputProps }: SearchFieldProps): UsePresenterResult => {
    const ref = useRef<HTMLInputElement>(null);
    const value = useSearchStore((state) => state.value);
    // While the screens swap, iOS would draw the caret flying over the animation.
    const isSwapping = useScreenStore((state) => state.isSwapping);
    // Made once: each keystroke restarts its wait.
    const search = useMemo(() => debounce(() => void searchQuery(), SEARCH_DEBOUNCE_MS), []);

    const handleChange = (next: string): void => {
        changeQuery(next);
        search();
    };

    const clear = (): void => {
        clearSearch();
        ref.current?.focus();
    };

    return {
        inputProps: { ...inputProps, caretColor: isSwapping ? "transparent" : inputProps.caretColor },
        id: SEARCH_FIELD_ID,
        ref,
        value,
        handleChange,
        handleClear: clearable ? clear : undefined,
    };
};
