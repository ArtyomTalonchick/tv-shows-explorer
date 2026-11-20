import { useShallow } from "zustand/react/shallow";
import type { ChipProps } from "@/lib/components/Chip/Chip";
import { showToast } from "@/lib/toast/showToast";
import { useSearchStore } from "@/stores/useSearchStore";
import { selectGenre } from "./_tasks/selectGenre";

type ChipItem = { key: string; props: ChipProps };

type UsePresenterResult = {
    // «All» with the number of all the found shows, then the genres of the shown answer.
    chips: ChipItem[];
};

export const usePresenter = (): UsePresenterResult => {
    const { query, genre, answer } = useSearchStore(
        useShallow((state) => ({ query: state.query, genre: state.genre, answer: state.answer })),
    );
    const data = answer?.data ?? null;
    // Another genre of the shown query is marked as soon as it is asked; while a new query waits and loads, the shown
    // results keep their own.
    const selected = answer?.query === query ? genre : (data?.genre ?? null);

    const select = async (next: string | null): Promise<void> => {
        try {
            await selectGenre(next);
        } catch {
            showToast({ icon: "alert", tone: "accent", urgent: true, text: "Couldn’t change the genre" });
        }
    };

    const all: ChipItem = {
        key: "",
        props: {
            children: "All",
            count: data?.found ?? 0,
            selected: selected === null,
            onClick: () => void select(null),
        },
    };
    const chips = (data?.genres ?? []).map(({ genre: name, count }): ChipItem => ({
        key: name,
        props: { children: name, count, selected: name === selected, onClick: () => void select(name) },
    }));

    return { chips: [all, ...chips] };
};
