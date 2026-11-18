import { useFavoritesLoad } from "./useFavoritesLoad";

// The app loads the favorites on start: the counters of both screens, the bookmarks and the list show them.
export const usePresenter = (): void => {
    useFavoritesLoad();
};
