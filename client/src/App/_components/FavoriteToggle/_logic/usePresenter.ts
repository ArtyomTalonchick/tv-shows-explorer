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
    // What a press does, for screen readers: «Add Dark to favourites»; in the list, where a show not saved is one
    // removed there, «Put Dark back in favourites».
    label: string;
    place: FavoriteTogglePlace;
    // Adds or removes the show, and says so in a toast; in the list, only a failure says so.
    handleClick: () => void;
};

export const usePresenter = ({ show, place = "card" }: FavoriteToggleProps): UsePresenterResult => {
    const saved = useFavoritesStore((state) => state.findFavorite(show.id));

    const label = ((): string => {
        if (saved !== null) {
            return `Remove ${show.name} from favourites`;
        }
        if (place === "list") {
            return `Put ${show.name} back in favourites`;
        }
        return `Add ${show.name} to favourites`;
    })();

    return {
        pressed: saved !== null,
        label,
        place,
        handleClick: () => void toggle(show, place),
    };
};
