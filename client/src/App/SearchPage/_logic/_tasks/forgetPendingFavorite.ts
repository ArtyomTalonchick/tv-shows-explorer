import { useFavoritesStore } from "~/stores/useFavoritesStore";

// Forgets the show a guest bookmarked: they came back to the search without signing in, so a later sign-in adds
// nothing.
export const forgetPendingFavorite = (): void => {
    useFavoritesStore.setState({ pending: null });
};
