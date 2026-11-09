import { getPageCount } from "../getPageCount";

describe("getPageCount", () => {
  it("counts full pages and the last partial one", () => {
    expect(getPageCount(9, 3)).toBe(3);
    expect(getPageCount(10, 3)).toBe(4);
    expect(getPageCount(2, 3)).toBe(1);
  });

  it("gives one page when there are no items", () => {
    expect(getPageCount(0, 3)).toBe(1);
  });
});
