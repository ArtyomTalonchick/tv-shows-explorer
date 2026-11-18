import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useQueryStore } from "../../_stores/useQueryStore";
import { useScreenStore } from "../../_stores/useScreenStore";

// Back to the start hero, animated, with the field emptied. The results screen unmounts, so its genre, page and
// answer go with it.
export const goHome = async (): Promise<void> => {
    await withViewTransition(() => {
        useQueryStore.getState().clear();
        useScreenStore.getState().setIsStart(true);
    });
};
