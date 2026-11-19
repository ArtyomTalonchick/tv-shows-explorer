import type { Favorite } from "@tv-shows-explorer/shared";
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
    const rows = favorites.map((favorite): RowItem => ({
        id: favorite.id,
        props: {
            name: favorite.name,
            href: favorite.url,
            image: favorite.image,
            meta: { show: favorite },
            toggle: { show: favorite },
        },
    }));

    return { rows };
};
