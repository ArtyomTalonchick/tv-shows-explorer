import { act, renderHook } from "@testing-library/react";
import { withViewTransition } from "@/lib/helpers/withViewTransition";
import { searchShows } from "../searchShows";
import { usePresenter } from "../usePresenter";

vi.mock("@/lib/helpers/withViewTransition", () => ({
  withViewTransition: vi.fn((update: () => void) => update()),
}));
vi.mock("../searchShows", () => ({ searchShows: vi.fn() }));

const transitionMock = vi.mocked(withViewTransition);

describe("SearchPage usePresenter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    transitionMock.mockClear();
    vi.mocked(searchShows).mockReturnValue(new Promise(() => {}));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts on the hero and opens the results screen, animated, when its field is focused", () => {
    const { result } = renderHook(() => usePresenter());
    expect(result.current.isStart).toBe(true);

    act(() => {
      result.current.hero.onOpen();
    });

    expect(transitionMock).toHaveBeenCalledTimes(1);
    expect(result.current.isStart).toBe(false);
    expect(result.current.results.status).toBe("idle");
  });

  it("stays on the results screen while typing, emptying and clearing, with no animation", () => {
    const { result } = renderHook(() => usePresenter());
    act(() => {
      result.current.hero.onOpen();
    });
    transitionMock.mockClear();

    act(() => result.current.results.onQueryChange("dark"));
    expect(result.current.results.status).toBe("loading");

    act(() => result.current.results.onQueryChange(""));
    expect(result.current.isStart).toBe(false);
    expect(result.current.results.status).toBe("idle");

    act(() => result.current.results.onQueryChange("dark"));
    act(() => result.current.results.onClear());
    expect(result.current.isStart).toBe(false);
    expect(result.current.results.query).toBe("");

    expect(transitionMock).not.toHaveBeenCalled();
  });

  it("goes back to the hero from the logo, animated, with the query reset", () => {
    const { result } = renderHook(() => usePresenter());
    act(() => {
      result.current.hero.onOpen();
    });
    act(() => result.current.results.onQueryChange("dark"));
    transitionMock.mockClear();

    act(() => {
      result.current.results.onHome();
    });

    expect(transitionMock).toHaveBeenCalledTimes(1);
    expect(result.current.isStart).toBe(true);
    expect(result.current.hero.query).toBe("");
    expect(result.current.results.status).toBe("idle");
  });
});
