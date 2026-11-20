import type { Show } from "@tv-shows-explorer/shared";

export type CardPosterProps = {
    show: Pick<Show, "name" | "image" | "rating">;
};

type UsePresenterResult = {
    imageSrc: string | undefined;
    imageAlt: string;
    hasImage: boolean;
    // A whole rating keeps its decimal: «★ 8.0», like «★ 8.2».
    ratingLabel: string | null;
};

export const usePresenter = ({ show: { name, image, rating } }: CardPosterProps): UsePresenterResult => {
    return {
        imageSrc: image ?? undefined,
        imageAlt: `${name} poster`,
        hasImage: image !== null,
        ratingLabel: rating === null ? null : `★ ${rating.toFixed(1)}`,
    };
};
