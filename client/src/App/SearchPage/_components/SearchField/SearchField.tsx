import type { FC } from "react";
import { SearchInput } from "@/lib/components/SearchInput/SearchInput";
import { usePresenter, type SearchFieldProps } from "./_logic/usePresenter";

export type { SearchFieldProps } from "./_logic/usePresenter";

// The search field, the same in the hero and in the search bar: one field in the search store. Typing searches once
// it stops; an emptied field stops the search at once.
export const SearchField: FC<SearchFieldProps> = (props) => {
    const { inputProps, inputRef, value, handleChange, onClear } = usePresenter(props);

    return (
        <SearchInput
            {...inputProps}
            ref={inputRef}
            label="Search shows"
            placeholder="Search shows, e.g. Dark"
            value={value}
            onChange={handleChange}
            onClear={onClear}
        />
    );
};
