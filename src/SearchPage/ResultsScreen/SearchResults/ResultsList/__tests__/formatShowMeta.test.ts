import { formatShowMeta } from "../formatShowMeta";

describe("formatShowMeta", () => {
  it("joins the years and the genres", () => {
    expect(formatShowMeta({ premiered: "2017-12-01", ended: "2020-06-27", genres: ["Drama", "Science-Fiction"] })).toBe(
      "2017–2020 · Drama, Science-Fiction",
    );
  });

  it("gives one year when a show began and ended in it", () => {
    expect(formatShowMeta({ premiered: "2019-03-01", ended: "2019-11-20", genres: ["Documentary"] })).toBe(
      "2019 · Documentary",
    );
  });

  it("leaves the end open while a show still runs", () => {
    expect(formatShowMeta({ premiered: "2022-02-18", ended: null, genres: ["Drama"] })).toBe("2022– · Drama");
  });

  it("leaves out the part with no data", () => {
    expect(formatShowMeta({ premiered: null, ended: null, genres: ["Drama"] })).toBe("Drama");
    expect(formatShowMeta({ premiered: "2019-01-01", ended: null, genres: [] })).toBe("2019–");
    expect(formatShowMeta({ premiered: null, ended: null, genres: [] })).toBe("");
  });
});
