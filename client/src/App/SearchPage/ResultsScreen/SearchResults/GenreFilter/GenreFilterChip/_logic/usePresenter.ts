import type { ChipProps } from "@/lib/ui-kit/Chip/Chip";
import { showToast } from "@/lib/toast/showToast";
import { useSearchStore } from "@/stores/useSearchStore";
import { selectGenre } from "./_tasks/selectGenre";

export type GenreFilterChipProps = {
    // `null` is «All».
    genre: string | null;
    count: number;
};

export const usePresenter = ({ genre, count }: GenreFilterChipProps): ChipProps => {
    const query = useSearchStore((state) => state.query);
    const asked = useSearchStore((state) => state.genre);
    const answer = useSearchStore((state) => state.answer);
    // Another genre of the shown query is marked as soon as it is asked; while a new query waits and loads, the shown
    // results keep their own.
    const selected = answer?.query === query ? asked : (answer?.data?.genre ?? null);

    const select = async (): Promise<void> => {
        try {
            await selectGenre(genre);
        } catch {
            showToast({ icon: "alert", tone: "accent", urgent: true, text: "Couldn’t change the genre" });
        }
    };

    return { children: genre ?? "All", count, selected: genre === selected, onClick: () => void select() };
};
