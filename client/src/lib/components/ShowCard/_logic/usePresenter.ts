import type { FavoriteToggleProps } from "@/lib/components/FavoriteToggle/FavoriteToggle";
import type { CardPosterProps } from "../CardPoster/CardPoster";

export type ShowCardProps = {
    name: string;
    // Where the card leads; it opens in a new tab.
    href: string;
    image: string | null;
    rating: number | null;
    // The line under the name, e.g. «2017–2020 · Drama, Science-Fiction».
    meta: string;
    // The bookmark on the card.
    favorite: Omit<FavoriteToggleProps, "variant">;
};

type UsePresenterResult = Pick<ShowCardProps, "name" | "href" | "meta" | "favorite"> & {
    poster: CardPosterProps;
};

export const usePresenter = ({ name, href, image, rating, meta, favorite }: ShowCardProps): UsePresenterResult => {
    return {
        name,
        href,
        meta,
        poster: {
            imageSrc: image ?? undefined,
            imageAlt: `${name} poster`,
            hasImage: image !== null,
            // A whole rating keeps its decimal: «★ 8.0», like «★ 8.2».
            ratingLabel: rating === null ? null : `★ ${rating.toFixed(1)}`,
        },
        favorite,
    };
};
