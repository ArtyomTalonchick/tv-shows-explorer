import { withViewTransition } from "@/lib/screen/withViewTransition";
import { useScreenStore } from "@/App/SearchPage/_stores/useScreenStore";
import { goHome } from "../goHome";

vi.mock("@/lib/screen/withViewTransition", () => ({
    withViewTransition: vi.fn(async (update: () => void) => update()),
}));

describe("goHome", () => {
    it("goes back to the hero with a transition, clearing the search inside it", async () => {
        useScreenStore.setState({ isStart: false });
        const clear = vi.fn(() => {
            expect(useScreenStore.getState().isStart).toBe(false);
        });

        await goHome(clear);

        expect(withViewTransition).toHaveBeenCalledTimes(1);
        expect(clear).toHaveBeenCalledTimes(1);
        expect(useScreenStore.getState().isStart).toBe(true);
    });
});
