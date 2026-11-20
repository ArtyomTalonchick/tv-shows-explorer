import { useSearchStore } from "@/stores/useSearchStore";
import { getSearchStatus } from "./getSearchStatus";

type UsePresenterResult = {
    // «Shows for “dark”» with the count; hidden with an empty field.
    hasHead: boolean;
    // Hidden when no found show has a genre.
    hasGenres: boolean;
    hasList: boolean;
    // The shown results wait for the next answer: dimmed, and nothing in them can be pressed.
    isBusy: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isEmpty: boolean;
    isError: boolean;
};

// The results area only chooses which state to show; each state reads the search store itself.
export const usePresenter = (): UsePresenterResult => {
    const value = useSearchStore((state) => state.value);
    const query = useSearchStore((state) => state.query);
    const isLoading = useSearchStore((state) => state.isLoading);
    const answer = useSearchStore((state) => state.answer);
    const status = getSearchStatus(value, answer);
    const hasList = status === "results";
    // Typing has not stopped yet, or the request is on its way.
    const isPending = value.trim() !== query || isLoading;

    return {
        hasHead: status !== "idle",
        hasGenres: hasList && (answer?.data?.genres.length ?? 0) > 0,
        hasList,
        isBusy: hasList && isPending,
        isIdle: status === "idle",
        isLoading: status === "loading",
        isEmpty: status === "empty",
        isError: status === "error",
    };
};
