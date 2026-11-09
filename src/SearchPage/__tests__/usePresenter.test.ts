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

  it("animates only when the hero and the bar swap", () => {
    const { result } = renderHook(() => usePresenter());

    act(() => result.current.changeQuery(" "));
    expect(transitionMock).not.toHaveBeenCalled();
    expect(result.current.isStart).toBe(true);

    act(() => result.current.changeQuery(" d"));
    expect(transitionMock).toHaveBeenCalledTimes(1);
    expect(result.current.isStart).toBe(false);

    act(() => result.current.changeQuery(" da"));
    expect(transitionMock).toHaveBeenCalledTimes(1);

    act(() => result.current.changeQuery(""));
    expect(transitionMock).toHaveBeenCalledTimes(2);
    expect(result.current.isStart).toBe(true);
  });

  it("animates Clear back to the hero", () => {
    const { result } = renderHook(() => usePresenter());
    act(() => result.current.changeQuery("dark"));
    transitionMock.mockClear();

    act(() => result.current.clear());

    expect(transitionMock).toHaveBeenCalledTimes(1);
    expect(result.current.query).toBe("");
    expect(result.current.isStart).toBe(true);
  });
});
