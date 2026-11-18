import type { SearchInputProps } from "@/lib/components/SearchInput/SearchInput";
import { useScreenSwap } from "@/App/SearchPage/_logic/useScreenSwap/useScreenSwap";
import { useSearchQuery } from "@/App/SearchPage/_logic/useSearchQuery";

type UsePresenterResult = {
    query: string;
    // Hidden while the screens swap.
    caretColor: SearchInputProps["caretColor"];
    onQueryChange: (query: string) => void;
    onClear: () => void;
    // The logo: back to the start screen.
    onHome: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const { value, handleChange, clear } = useSearchQuery();
    const { isSwapping, goHome } = useScreenSwap();

    return {
        query: value,
        caretColor: isSwapping ? "transparent" : undefined,
        onQueryChange: handleChange,
        onClear: clear,
        onHome: goHome,
    };
};
