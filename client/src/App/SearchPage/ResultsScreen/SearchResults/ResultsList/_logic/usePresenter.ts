import type { Show } from "@tv-shows-explorer/shared";
import { useSearchStore } from "~/stores/useSearchStore";

type UsePresenterResult = {
    // One page of the shown answer.
    shows: Show[];
};

export const usePresenter = (): UsePresenterResult => {
    const answer = useSearchStore((state) => state.answer);

    return { shows: answer?.data?.shows ?? [] };
};
