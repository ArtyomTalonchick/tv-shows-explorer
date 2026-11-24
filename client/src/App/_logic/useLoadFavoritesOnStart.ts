import { useEffect } from "react";
import { showToast } from "~/lib/toast/showToast";
import { loadFavorites } from "~/tasks/favorites/loadFavorites";

// Loads the favorites once, on start: the counters of both screens, the bookmarks and the list show them. A failure
// says so in a toast with Retry; until then the counter and the list show only the changes made since, and a press on
// a bookmark still works.
export const useLoadFavoritesOnStart = (): void => {
    useEffect(() => {
        const controller = new AbortController();

        const load = async (): Promise<void> => {
            try {
                await loadFavorites(controller.signal);
            } catch {
                if (!controller.signal.aborted) {
                    showToast({
                        text: "Couldn’t load your favourites",
                        icon: "alert",
                        tone: "accent",
                        urgent: true,
                        action: { label: "Retry", onClick: () => void load() },
                    });
                }
            }
        };
        void load();

        return () => controller.abort();
    }, []);
};
