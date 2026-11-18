import { waitForKeyboard } from "../waitForKeyboard";

describe("waitForKeyboard", () => {
    afterEach(() => {
        vi.useRealTimers();
        // jsdom has no Visual Viewport API; a test that adds it removes it.
        Reflect.deleteProperty(window, "visualViewport");
    });

    const stubViewport = (): EventTarget => {
        const viewport = new EventTarget();
        Object.defineProperty(window, "visualViewport", { value: viewport, configurable: true });
        return viewport;
    };

    it("resolves at once without the Visual Viewport API", async () => {
        await expect(waitForKeyboard(600)).resolves.toBeUndefined();
    });

    it("resolves when the viewport resizes for the keyboard", async () => {
        vi.useFakeTimers();
        const viewport = stubViewport();
        const resolved = vi.fn();

        const waiting = (async (): Promise<void> => {
            await waitForKeyboard(600);
            resolved();
        })();
        await vi.advanceTimersByTimeAsync(100);
        expect(resolved).not.toHaveBeenCalled();
        viewport.dispatchEvent(new Event("resize"));
        await waiting;

        expect(resolved).toHaveBeenCalledTimes(1);
    });

    it("resolves after the timeout when no keyboard comes", async () => {
        vi.useFakeTimers();
        stubViewport();
        const resolved = vi.fn();

        const waiting = (async (): Promise<void> => {
            await waitForKeyboard(600);
            resolved();
        })();
        await vi.advanceTimersByTimeAsync(599);
        expect(resolved).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1);
        await waiting;

        expect(resolved).toHaveBeenCalledTimes(1);
    });
});
