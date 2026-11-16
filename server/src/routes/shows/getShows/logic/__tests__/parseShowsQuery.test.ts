import { parseShowsQuery } from "../parseShowsQuery";

describe("parseShowsQuery", () => {
  it("reads the trimmed query, the genre and the page", () => {
    expect(parseShowsQuery({ q: " dark ", genre: "Drama", page: "2" })).toEqual({
      query: "dark",
      genre: "Drama",
      page: 2,
    });
  });

  it("takes no genre and page 1 when they are left out or empty", () => {
    expect(parseShowsQuery({ q: "dark" })).toEqual({ query: "dark", genre: null, page: 1 });
    expect(parseShowsQuery({ q: "dark", genre: "" })).toEqual({ query: "dark", genre: null, page: 1 });
  });

  it("makes no request of a missing or blank query", () => {
    expect(parseShowsQuery({})).toBeNull();
    expect(parseShowsQuery({ q: "   " })).toBeNull();
  });

  it.each(["0", "-1", "1.5", "01", "two", ""])("makes no request of the page %j", (page) => {
    expect(parseShowsQuery({ q: "dark", page })).toBeNull();
  });
});
