import type { SearchInputProps } from "@/lib/components/SearchInput/SearchInput";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { goHome } from "./goHome";

type UsePresenterResult = {
    // Hidden while the screens swap.
    caretColor: SearchInputProps["caretColor"];
    // The logo: back to the start screen.
    onHome: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const isSwapping = useScreenStore((state) => state.isSwapping);

    return {
        caretColor: isSwapping ? "transparent" : undefined,
        onHome: () => void goHome(),
    };
};
