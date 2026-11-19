import { favoritesStore } from "@/stores/favoritesStore/favoritesStore";
import { fetchTvmazeShow } from "./fetchTvmazeShow";
import { findCachedShow } from "./findCachedShow";

// Adds the show to the favorites of one browser, keeping what the list shows. The show is taken from the search
// cache, or else asked of TVmaze. A show already there changes nothing and asks nothing. `addedAt` places it in the
// list: now for a new favorite, the old time for one put back by Undo. Rejects as `fetchTvmazeShow` does.
export const addFavorite = async (
    clientId: string,
    id: number,
    addedAt: number,
    signal: AbortSignal,
): Promise<void> => {
    if (await favoritesStore.has(clientId, id)) {
        return;
    }

    const show = findCachedShow(id) ?? (await fetchTvmazeShow(id, signal));
    await favoritesStore.put(clientId, {
        id: show.id,
        name: show.name,
        genres: show.genres,
        premiered: show.premiered,
        ended: show.ended,
        image: show.image,
        url: show.url,
        addedAt,
    });
};
