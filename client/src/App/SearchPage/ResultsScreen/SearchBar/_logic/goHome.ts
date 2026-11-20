import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";

// Back to the start hero, animated. `clear` empties the field and forgets the search inside the same transition, so
// the hero comes back with an empty field.
export const goHome = async (clear: () => void): Promise<void> => {
    await withViewTransition(() => {
        clear();
        useScreenStore.setState({ isStart: true });
    });
};
