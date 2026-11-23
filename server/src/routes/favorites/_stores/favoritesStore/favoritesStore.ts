import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesOf } from "./favoritesOf";

// The favorites of each browser, by its client id, in Firestore wherever the server runs, local development
// included; reached only by the tasks of the favorites routes: `listFavorites`, `addFavorite` and `removeFavorite`.
// The tests mock it. A document per show: `clients/{clientId}/favorites/{showId}`. The Admin SDK finds its project
// and credentials on its own: inside Cloud Functions from Firebase, locally from Application Default Credentials and
// `GOOGLE_CLOUD_PROJECT`, so the code holds no key.
export const favoritesStore = {
    // The favorites of one browser, in no particular order; none for a browser without a list.
    list: async (clientId: string): Promise<Favorite[]> => {
        const snapshot = await favoritesOf(clientId).get();
        return snapshot.docs.map((doc) => doc.data() as Favorite);
    },
    // The favorite with this id; null when it is not there.
    get: async (clientId: string, id: number): Promise<Favorite | null> => {
        const snapshot = await favoritesOf(clientId).doc(String(id)).get();
        return snapshot.exists ? (snapshot.data() as Favorite) : null;
    },
    // Adds the favorite, or replaces the one with its id.
    put: async (clientId: string, favorite: Favorite): Promise<void> => {
        await favoritesOf(clientId).doc(String(favorite.id)).set(favorite);
    },
    // A show that is not there changes nothing.
    remove: async (clientId: string, id: number): Promise<void> => {
        await favoritesOf(clientId).doc(String(id)).delete();
    },
};
