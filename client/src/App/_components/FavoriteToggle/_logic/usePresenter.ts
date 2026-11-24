import type { Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { toggle } from "./toggle/toggle";

export type FavoriteToggleProps = {
    // The show the bookmark adds to the favourites or removes from them.
    show: Omit<Show, "rating">;
    // `poster` floats over a poster in a glass circle; `plain` sits in a row of the favourites list.
    variant?: "poster" | "plain";
};

type UsePresenterResult = {
    // The show is a favourite.
    pressed: boolean;
    // What a press does, for screen readers: «Add Dark to favourites».
    label: string;
    variant: NonNullable<FavoriteToggleProps["variant"]>;
    // Adds or removes the show, and says so in a toast.
    handleClick: () => void;
};

export const usePresenter = ({ show, variant = "poster" }: FavoriteToggleProps): UsePresenterResult => {
    const saved = useFavoritesStore((state) => state.findFavorite(show.id));

    return {
        pressed: saved !== null,
        label: saved === null ? `Add ${show.name} to favourites` : `Remove ${show.name} from favourites`,
        variant,
        handleClick: () => void toggle(show),
    };
};
