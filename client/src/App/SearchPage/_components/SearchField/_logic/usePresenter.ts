import { useMemo } from "react";
import { debounce } from "@/lib/debounce/debounce";
import type { SearchInputProps } from "@/lib/components/SearchInput/SearchInput";
import { useSearchStore } from "@/stores/useSearchStore";
import { changeQuery } from "./_tasks/changeQuery";
import { searchQuery } from "./_tasks/searchQuery";

// The props of the field (`size`, `onFocus`, `autoFocus`, `caretColor`, `ref`…) go to it as they are; `onClear` shows
// its × button while it holds text. What it holds, its name and its placeholder are the search's own.
export type SearchFieldProps = Omit<SearchInputProps, "value" | "onChange" | "label" | "placeholder">;

// The search goes once typing has stopped for this long.
const SEARCH_DEBOUNCE_MS = 400;

type UsePresenterResult = {
    inputProps: SearchFieldProps;
    value: string;
    handleChange: (value: string) => void;
};

export const usePresenter = (inputProps: SearchFieldProps): UsePresenterResult => {
    const value = useSearchStore((state) => state.value);
    // Made once: each keystroke restarts its wait.
    const search = useMemo(() => debounce(() => void searchQuery(), SEARCH_DEBOUNCE_MS), []);

    const handleChange = (next: string): void => {
        changeQuery(next);
        search();
    };

    return { inputProps, value, handleChange };
};
