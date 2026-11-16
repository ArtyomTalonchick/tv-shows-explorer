import { filterByGenre } from "../filterByGenre";

const SHOWS = [
  { name: "Dark", genres: ["Drama", "Science-Fiction"] },
  { name: "The Bear", genres: ["Drama", "Comedy"] },
  { name: "Darkroom", genres: [] },
];

describe("filterByGenre", () => {
  it("keeps only the shows of the genre", () => {
    expect(filterByGenre(SHOWS, "Comedy").map((show) => show.name)).toEqual(["The Bear"]);
    expect(filterByGenre(SHOWS, "Drama").map((show) => show.name)).toEqual(["Dark", "The Bear"]);
  });

  it("gives the same list back with no genre", () => {
    expect(filterByGenre(SHOWS, null)).toBe(SHOWS);
  });

  it("gives nothing for a genre no show has", () => {
    expect(filterByGenre(SHOWS, "Western")).toEqual([]);
  });
});
