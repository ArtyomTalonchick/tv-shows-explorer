// Resolves once the on-screen keyboard has opened — the visual viewport resizes for it — or after `timeout` ms, when
// none comes (a hardware keyboard, a desktop). Without the Visual Viewport API it resolves at once.
export const waitForKeyboard = async (timeout: number): Promise<void> => {
    const viewport = window.visualViewport;
    if (!viewport) {
        return;
    }

    await new Promise<void>((resolve) => {
        const done = (): void => {
            clearTimeout(timer);
            viewport.removeEventListener("resize", done);
            resolve();
        };
        const timer = setTimeout(done, timeout);
        viewport.addEventListener("resize", done);
    });
};
