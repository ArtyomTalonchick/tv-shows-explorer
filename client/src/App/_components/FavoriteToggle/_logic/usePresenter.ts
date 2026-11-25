import type { Show } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";
import { toggle } from "./toggle/toggle";

// Where a bookmark sits: over a poster of a card, or in a row of the favourites list.
export type FavoriteTogglePlace = "card" | "list";

export type FavoriteToggleProps = {
    // The show the bookmark adds to the favourites or removes from them.
    show: Omit<Show, "rating">;
    // Where the bookmark sits: `card` floats over a poster in a glass circle, and says what it did in a toast; `list`
    // sits plain in a row of the favourites list, whose row itself says so, and only a failure has a toast.
    place?: FavoriteTogglePlace;
};

type UsePresenterResult = {
    // The show is a favourite.
    pressed: boolean;
    // What a press does, for screen readers: «Add Dark to favourites».
    label: string;
    place: FavoriteTogglePlace;
    // Adds or removes the show, and says so in a toast; in the list, only a failure says so.
    handleClick: () => void;
};

export const usePresenter = ({ show, place = "card" }: FavoriteToggleProps): UsePresenterResult => {
    const saved = useFavoritesStore((state) => state.findFavorite(show.id));

    return {
        pressed: saved !== null,
        label: saved === null ? `Add ${show.name} to favourites` : `Remove ${show.name} from favourites`,
        place,
        handleClick: () => void toggle(show, place),
    };
};
