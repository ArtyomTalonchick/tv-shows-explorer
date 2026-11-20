import type { Favorite } from "@tv-shows-explorer/shared";

export type FavoriteRowProps = {
    favorite: Favorite;
};

type UsePresenterResult = FavoriteRowProps & {
    name: string;
    // Where the row leads; it opens in a new tab.
    href: string;
    imageSrc: string | undefined;
    hasImage: boolean;
};

export const usePresenter = ({ favorite }: FavoriteRowProps): UsePresenterResult => {
    return {
        favorite,
        name: favorite.name,
        href: favorite.url,
        imageSrc: favorite.image ?? undefined,
        hasImage: favorite.image !== null,
    };
};
