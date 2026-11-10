import { act, renderHook } from "@testing-library/react";
import { redrawCaret } from "@/lib/helpers/redrawCaret";
import { withViewTransition } from "@/lib/helpers/withViewTransition";
import { useScreenSwap } from "../useScreenSwap";

vi.mock("@/lib/helpers/withViewTransition", () => ({
  withViewTransition: vi.fn(async (update: () => void) => update()),
}));
vi.mock("@/lib/helpers/redrawCaret", () => ({ redrawCaret: vi.fn() }));

describe("useScreenSwap", () => {
  beforeEach(() => {
    vi.mocked(withViewTransition).mockClear();
    vi.mocked(redrawCaret).mockClear();
  });

  it("opens the results screen with a transition, then shows and redraws the caret", async () => {
    const { result } = renderHook(() => useScreenSwap(vi.fn()));
    expect(result.current.isStart).toBe(true);

    await act(async () => {
      await result.current.open();
    });

    expect(withViewTransition).toHaveBeenCalledTimes(1);
    expect(result.current).toMatchObject({ isStart: false, isSwapping: false });
    expect(redrawCaret).toHaveBeenCalledTimes(1);
  });

  it("goes home with a transition and empties the field", async () => {
    const clearQuery = vi.fn();
    const { result } = renderHook(() => useScreenSwap(clearQuery));
    await act(async () => {
      await result.current.open();
    });

    await act(async () => {
      await result.current.goHome();
    });

    expect(withViewTransition).toHaveBeenCalledTimes(2);
    expect(clearQuery).toHaveBeenCalledTimes(1);
    expect(result.current.isStart).toBe(true);
  });
});
