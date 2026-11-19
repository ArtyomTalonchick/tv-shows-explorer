import { useEffect } from "react";
import { useRequest } from "@/lib/request/useRequest";
import { showToast } from "@/lib/toast/showToast";
import { loadFavorites } from "@/tasks/favorites/loadFavorites";

const ON_START = "start";

// Loads the browser's favorites once, when the app starts. A failure says so in a toast with Retry; until then the
// counter shows 0, and a press on a bookmark still works: the server answers it with the whole list.
export const useFavoritesLoad = (): void => {
    const { current, retry } = useRequest(loadFavorites, ON_START);
    const failed = current?.failed ?? false;

    useEffect(() => {
        if (failed) {
            showToast({
                text: "Couldn’t load your favourites",
                icon: "alert",
                tone: "accent",
                urgent: true,
                action: { label: "Retry", onClick: retry },
            });
        }
    }, [failed, retry]);
};
