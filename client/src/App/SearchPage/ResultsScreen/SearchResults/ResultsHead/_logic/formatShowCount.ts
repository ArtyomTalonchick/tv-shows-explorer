import type { ShowsPage } from "@tv-shows-explorer/shared";

// «9 shows», «1 show», «0 shows»; with a genre, the shows of it out of all the found ones: «4 of 9 shows · Drama».
export const formatShowCount = ({ found, total, genre }: Pick<ShowsPage, "found" | "total" | "genre">): string => {
    const all = `${found} ${found === 1 ? "show" : "shows"}`;
    if (genre === null) {
        return all;
    }
    return `${total} of ${all} · ${genre}`;
};
