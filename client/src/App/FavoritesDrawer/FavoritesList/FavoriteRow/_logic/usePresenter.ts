import type { Favorite } from "@tv-shows-explorer/shared";
import { useFavoritesStore } from "~/stores/useFavoritesStore";

export type FavoriteRowProps = {
    favorite: Favorite;
};

// `removed`: the show was removed while the list is open; the row keeps its place until the list opens again.
export type FavoriteRowState = "saved" | "removed";

type UsePresenterResult = FavoriteRowProps & {
    state: FavoriteRowState;
    // The show was removed while the list is open: the row says «Removed» in place of the details.
    isRemoved: boolean;
    name: string;
    // Where the row leads; it opens in a new tab.
    href: string;
    imageSrc: string | undefined;
    hasImage: boolean;
};

export const usePresenter = ({ favorite }: FavoriteRowProps): UsePresenterResult => {
    const saved = useFavoritesStore((state) => state.findFavorite(favorite.id));

    return {
        favorite,
        state: saved === null ? "removed" : "saved",
        isRemoved: saved === null,
        name: favorite.name,
        href: favorite.url,
        imageSrc: favorite.image ?? undefined,
        hasImage: favorite.image !== null,
    };
};
