import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { useSearchStore } from "@/stores/useSearchStore";
import { goHome } from "../goHome";

vi.mock("@/lib/screen/withViewTransition", () => ({
    withViewTransition: vi.fn(async (update: () => void) => update()),
}));

describe("goHome", () => {
    it("goes back to the hero with a transition, with the field emptied and the search forgotten", async () => {
        useScreenStore.setState({ isStart: false });
        useSearchStore.setState({ value: "dark", query: "dark", genre: "Drama", page: 2 });

        await goHome();

        expect(withViewTransition).toHaveBeenCalledTimes(1);
        expect(useScreenStore.getState().isStart).toBe(true);
        expect(useSearchStore.getState()).toMatchObject({ value: "", query: "", genre: null, page: 1, answer: null });
    });
});
