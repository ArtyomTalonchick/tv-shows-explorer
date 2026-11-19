// Wraps `fn` so that it runs once the calls have stopped for `delayMs`, with the arguments of the last call. Each
// call restarts the wait. The wrapper keeps its timer, so make it once and keep it.
export const debounce = <A extends unknown[]>(fn: (...args: A) => void, delayMs: number): ((...args: A) => void) => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return (...args: A): void => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delayMs);
    };
};
