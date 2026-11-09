import { scrollToTopIfAbove } from "../scrollToTopIfAbove";

const elementAt = (top: number) => {
  const element = document.createElement("div");
  element.getBoundingClientRect = () => ({ top }) as DOMRect;
  return element;
};

describe("scrollToTopIfAbove", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    scrollTo.mockReset();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("scrolls to the top smoothly when the element starts above the screen", () => {
    scrollToTopIfAbove(elementAt(-200));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("jumps without animation when the user asks for reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: true, media: query }));

    scrollToTopIfAbove(elementAt(-200));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("leaves the page where it is when the element starts on the screen", () => {
    scrollToTopIfAbove(elementAt(120));
    scrollToTopIfAbove(null);

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
