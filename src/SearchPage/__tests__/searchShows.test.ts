import { searchShows } from "../searchShows";

const respond = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("searchShows", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks TVmaze with the encoded query and the signal", async () => {
    const fetchMock = respond([]);
    vi.stubGlobal("fetch", fetchMock);
    const { signal } = new AbortController();

    await searchShows("doctor who & co", signal);

    expect(fetchMock).toHaveBeenCalledWith("https://api.tvmaze.com/search/shows?q=doctor%20who%20%26%20co", {
      signal,
    });
  });

  it("maps the results, with no rating and no image as null", async () => {
    vi.stubGlobal(
      "fetch",
      respond([
        {
          score: 0.9,
          show: {
            id: 1,
            name: "Dark",
            genres: ["Drama"],
            rating: { average: 8.2 },
            premiered: "2017-12-01",
            ended: "2020-06-27",
            image: { medium: "m.jpg", original: "o.jpg" },
          },
        },
        {
          score: 0.5,
          show: {
            id: 2,
            name: "Darkroom",
            genres: [],
            rating: { average: null },
            premiered: null,
            ended: null,
            image: null,
          },
        },
      ]),
    );

    await expect(searchShows("dark", new AbortController().signal)).resolves.toEqual([
      {
        id: 1,
        name: "Dark",
        genres: ["Drama"],
        rating: 8.2,
        premiered: "2017-12-01",
        ended: "2020-06-27",
        image: "m.jpg",
      },
      { id: 2, name: "Darkroom", genres: [], rating: null, premiered: null, ended: null, image: null },
    ]);
  });

  it("rejects on a non-2xx answer", async () => {
    vi.stubGlobal("fetch", respond({ message: "busy" }, 503));

    await expect(searchShows("dark", new AbortController().signal)).rejects.toThrow("TVmaze answered 503");
  });
});
