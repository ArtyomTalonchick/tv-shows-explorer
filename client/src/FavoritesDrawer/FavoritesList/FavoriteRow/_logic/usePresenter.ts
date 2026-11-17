import type { FavoriteToggleProps } from "@/_components/FavoriteToggle/FavoriteToggle";

export type FavoriteRowProps = {
    name: string;
    // Where the row leads; it opens in a new tab.
    href: string;
    image: string | null;
    // The line under the name, e.g. «2017–2020 · Drama, Science-Fiction».
    meta: string;
    // The bookmark at the end of the row: a press removes the show.
    toggle: Omit<FavoriteToggleProps, "variant">;
};

type UsePresenterResult = Omit<FavoriteRowProps, "image"> & {
    imageSrc: string | undefined;
    hasImage: boolean;
};

export const usePresenter = ({ image, ...rest }: FavoriteRowProps): UsePresenterResult => {
    return { ...rest, imageSrc: image ?? undefined, hasImage: image !== null };
};
