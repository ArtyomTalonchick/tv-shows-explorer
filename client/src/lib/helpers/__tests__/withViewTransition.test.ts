import { withViewTransition } from "../withViewTransition";

describe("withViewTransition", () => {
  afterEach(() => {
    // jsdom has no View Transitions API; a test that adds it removes it.
    Reflect.deleteProperty(document, "startViewTransition");
  });

  it("runs the update at once when the browser has no view transitions", async () => {
    const update = vi.fn();

    await withViewTransition(update);

    expect(update).toHaveBeenCalledTimes(1);
  });

  it("runs the update inside a view transition and resolves when it has finished", async () => {
    const update = vi.fn();
    const start = vi.fn((callback: () => void) => {
      expect(update).not.toHaveBeenCalled();
      callback();
      return { finished: Promise.resolve() };
    });
    Object.defineProperty(document, "startViewTransition", { value: start, configurable: true });

    await withViewTransition(update);

    expect(start).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
  });
});
