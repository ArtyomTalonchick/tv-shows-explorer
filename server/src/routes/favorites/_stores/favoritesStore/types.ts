import type { Favorite } from "@tv-shows-explorer/shared";

// The API of the favorites store, whichever place keeps them. Async, so where the favorites are kept can change
// without changing the tasks.
export type FavoritesStore = {
    // The favorites of one browser, in no particular order; none for a browser without a list.
    list: (clientId: string) => Promise<Favorite[]>;
    // The favorite with this id; null when it is not there.
    get: (clientId: string, id: number) => Promise<Favorite | null>;
    // Adds the favorite, or replaces the one with its id.
    put: (clientId: string, favorite: Favorite) => Promise<void>;
    // A show that is not there changes nothing.
    remove: (clientId: string, id: number) => Promise<void>;
};
