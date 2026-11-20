import type { Show } from "@tv-shows-explorer/shared";
import { useFavoriteToggle } from "./useFavoriteToggle/useFavoriteToggle";

export type FavoriteToggleProps = {
    // The show the bookmark adds to the favourites or removes from them.
    show: Omit<Show, "rating">;
    // `poster` floats over a poster in a glass circle; `plain` sits in a row of the favourites list.
    variant?: "poster" | "plain";
};

type UsePresenterResult = {
    pressed: boolean;
    label: string;
    variant: NonNullable<FavoriteToggleProps["variant"]>;
    handleClick: () => void;
};

export const usePresenter = ({ show, variant = "poster" }: FavoriteToggleProps): UsePresenterResult => {
    const { pressed, label, toggle } = useFavoriteToggle(show);

    return { pressed, label, variant, handleClick: toggle };
};
