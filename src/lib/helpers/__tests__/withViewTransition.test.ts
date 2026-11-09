import { withViewTransition } from "../withViewTransition";

describe("withViewTransition", () => {
  afterEach(() => {
    // jsdom has no View Transitions API; a test that adds it removes it.
    Reflect.deleteProperty(document, "startViewTransition");
  });

  it("runs the update at once when the browser has no view transitions", () => {
    const update = vi.fn();

    withViewTransition(update);

    expect(update).toHaveBeenCalledTimes(1);
  });

  it("runs the update inside a view transition when the browser has them", () => {
    const update = vi.fn();
    const start = vi.fn((callback: () => void) => {
      expect(update).not.toHaveBeenCalled();
      callback();
    });
    Object.defineProperty(document, "startViewTransition", { value: start, configurable: true });

    withViewTransition(update);

    expect(start).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
  });
});
