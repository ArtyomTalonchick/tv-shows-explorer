import type { Favorite, Show } from "@tv-shows-explorer/shared";

// The favorite the store shows for a show until the server answers its own.
export const toFavorite = (
    { id, name, genres, premiered, ended, image, url }: Omit<Show, "rating">,
    addedAt: number,
): Favorite => {
    return { id, name, genres, premiered, ended, image, url, addedAt };
};
