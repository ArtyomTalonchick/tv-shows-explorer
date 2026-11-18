import type { Favorite } from "@tv-shows-explorer/shared";

// The API of the favorites store, whichever place keeps them. Async, so where the favorites are kept can change
// without changing the tasks.
export type FavoritesStore = {
    // The favorites of one browser, in no particular order; none for a browser without a list.
    list: (clientId: string) => Promise<Favorite[]>;
    has: (clientId: string, id: number) => Promise<boolean>;
    // Adds the favorite, or replaces the one with its id.
    put: (clientId: string, favorite: Favorite) => Promise<void>;
    // A show that is not there changes nothing.
    remove: (clientId: string, id: number) => Promise<void>;
    // Forgets every browser's favorites: for tests.
    clear: () => Promise<void>;
};
