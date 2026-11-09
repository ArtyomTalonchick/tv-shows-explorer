import { collectGenres } from "../collectGenres";

describe("collectGenres", () => {
  it("counts each genre once per show, the most common first, a tie alphabetically", () => {
    const shows = [
      { genres: ["Drama", "Crime"] },
      { genres: ["Drama", "Science-Fiction"] },
      { genres: ["Comedy", "Drama"] },
      { genres: ["Crime"] },
    ];

    expect(collectGenres(shows)).toEqual([
      { genre: "Drama", count: 3 },
      { genre: "Crime", count: 2 },
      { genre: "Comedy", count: 1 },
      { genre: "Science-Fiction", count: 1 },
    ]);
  });

  it("counts a genre listed twice in one show once", () => {
    expect(collectGenres([{ genres: ["Drama", "Drama"] }])).toEqual([{ genre: "Drama", count: 1 }]);
  });

  it("gives no genres when no show has one", () => {
    expect(collectGenres([{ genres: [] }, { genres: [] }])).toEqual([]);
    expect(collectGenres([])).toEqual([]);
  });
});
