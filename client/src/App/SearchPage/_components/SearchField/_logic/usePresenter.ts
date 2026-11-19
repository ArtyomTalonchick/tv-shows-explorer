import { useMemo, useRef, type RefObject } from "react";
import { debounce } from "@/lib/debounce/debounce";
import type { SearchInputProps } from "@/lib/components/SearchInput/SearchInput";
import { useSearchStore } from "@/stores/useSearchStore";
import { clearSearch } from "@/tasks/search/clearSearch";
import { changeQuery } from "./_tasks/changeQuery";
import { searchQuery } from "./_tasks/searchQuery";

// The props of the field (`size`, `onFocus`, `autoFocus`, `caretColor`…) go to it as they are. What it holds, its
// name and its placeholder are the search's own.
export type SearchFieldProps = Omit<
    SearchInputProps,
    "value" | "onChange" | "onClear" | "label" | "placeholder" | "ref"
> & {
    // The × button, while the field holds text: empties it and gives it the focus back.
    clearable?: boolean;
};

// The search goes once typing has stopped for this long.
const SEARCH_DEBOUNCE_MS = 400;

type UsePresenterResult = {
    inputProps: Omit<SearchFieldProps, "clearable">;
    inputRef: RefObject<HTMLInputElement | null>;
    value: string;
    handleChange: (value: string) => void;
    onClear: (() => void) | undefined;
};

export const usePresenter = ({ clearable = false, ...inputProps }: SearchFieldProps): UsePresenterResult => {
    const value = useSearchStore((state) => state.value);
    const inputRef = useRef<HTMLInputElement>(null);
    // Made once: each keystroke restarts its wait.
    const search = useMemo(() => debounce(() => void searchQuery(), SEARCH_DEBOUNCE_MS), []);

    const handleChange = (next: string): void => {
        changeQuery(next);
        search();
    };

    const clear = (): void => {
        clearSearch();
        inputRef.current?.focus();
    };

    return { inputProps, inputRef, value, handleChange, onClear: clearable ? clear : undefined };
};
