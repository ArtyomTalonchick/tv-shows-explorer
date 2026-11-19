import { debounce } from "../debounce";

describe("debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("runs once the calls have stopped for the delay, with the last arguments", () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 400);

        debounced("d");
        vi.advanceTimersByTime(300);
        debounced("da");
        vi.advanceTimersByTime(399);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith("da");
    });

    it("runs again for calls after the wait", () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 400);

        debounced();
        vi.advanceTimersByTime(400);
        debounced();
        vi.advanceTimersByTime(400);

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
