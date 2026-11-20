import type { FC } from "react";
import { Chip } from "@/lib/components/Chip/Chip";
import { usePresenter, type GenreFilterChipProps } from "./_logic/usePresenter";

export type { GenreFilterChipProps } from "./_logic/usePresenter";

// One genre chip, or «All»: marked while its genre is shown, and pressing it shows that genre's shows.
export const GenreFilterChip: FC<GenreFilterChipProps> = (props) => {
    const chip = usePresenter(props);

    return <Chip {...chip} />;
};
