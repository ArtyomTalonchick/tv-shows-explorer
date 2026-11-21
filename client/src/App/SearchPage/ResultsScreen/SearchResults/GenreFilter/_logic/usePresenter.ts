import { useSearchStore } from "~/stores/useSearchStore";
import type { GenreFilterChipProps } from "../GenreFilterChip/GenreFilterChip";

type ChipItem = { key: string; props: GenreFilterChipProps };

type UsePresenterResult = {
    // «All» with the number of all the found shows, then the genres of the shown answer.
    chips: ChipItem[];
};

export const usePresenter = (): UsePresenterResult => {
    const answer = useSearchStore((state) => state.answer);
    const data = answer?.data ?? null;

    const all: ChipItem = { key: "", props: { genre: null, count: data?.found ?? 0 } };
    const chips = (data?.genres ?? []).map(({ genre, count }): ChipItem => ({ key: genre, props: { genre, count } }));

    return { chips: [all, ...chips] };
};
