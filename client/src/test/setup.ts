import "@testing-library/jest-dom/vitest";

// jsdom has no ResizeObserver; Chakra's menus and popovers watch their size with it to place themselves.
class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
}
globalThis.ResizeObserver ??= ResizeObserverStub;
