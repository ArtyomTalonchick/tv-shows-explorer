import { useSearchStore } from "~/stores/useSearchStore";
import { formatShowCount } from "./formatShowCount";

type UsePresenterResult = {
    // The query of the shown answer; the query being typed while there is none.
    query: string;
    // «9 shows», «4 of 9 shows · Drama», «0 shows»; hidden while no answer is on screen.
    count: string | null;
};

export const usePresenter = (): UsePresenterResult => {
    const value = useSearchStore((state) => state.value);
    const answer = useSearchStore((state) => state.answer);
    const data = answer?.data ?? null;

    return {
        query: answer?.query ?? value.trim(),
        count: data === null ? null : formatShowCount(data),
    };
};
