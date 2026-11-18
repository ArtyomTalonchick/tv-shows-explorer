import type { Favorite } from "@tv-shows-explorer/shared";
import { formatShowMeta } from "@/App/_logic/formatShowMeta";
import { useFavoriteToggle } from "@/App/_logic/useFavoriteToggle/useFavoriteToggle";
import type { FavoriteRowProps } from "../FavoriteRow/FavoriteRow";

export type FavoritesListProps = {
    // The newest first, as the server answers them.
    favorites: Favorite[];
};

type RowItem = { id: number; props: FavoriteRowProps };

type UsePresenterResult = {
    rows: RowItem[];
};

export const usePresenter = ({ favorites }: FavoritesListProps): UsePresenterResult => {
    const { toggleFor } = useFavoriteToggle();

    const rows = favorites.map((favorite): RowItem => ({
        id: favorite.id,
        props: {
            name: favorite.name,
            href: favorite.url,
            image: favorite.image,
            meta: formatShowMeta(favorite),
            toggle: toggleFor(favorite),
        },
    }));

    return { rows };
};
