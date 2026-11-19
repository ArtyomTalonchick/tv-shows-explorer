import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { useSearchStore } from "@/stores/useSearchStore";

// Back to the start hero, animated, with the field emptied and the search forgotten: its genre, page and answer.
export const goHome = async (): Promise<void> => {
    await withViewTransition(() => {
        useSearchStore.getState().clear();
        useScreenStore.getState().setIsStart(true);
    });
};
