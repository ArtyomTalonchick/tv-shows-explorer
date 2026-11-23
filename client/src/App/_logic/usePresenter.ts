import { useLoadFavoritesOnStart } from "./useLoadFavoritesOnStart";

// The app on start: it loads the favorites.
export const usePresenter = (): void => {
    useLoadFavoritesOnStart();
};
