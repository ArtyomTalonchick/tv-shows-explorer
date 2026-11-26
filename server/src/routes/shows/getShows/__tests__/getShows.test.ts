import { Hono } from "hono";
import { searchCache } from "~/routes/_stores/searchCache";
import { getShows } from "../getShows";

const tvmazeShow = (id: number, genres: string[]) => ({
    score: 1,
    show: {
        id,
        name: `Show ${id}`,
        genres,
        rating: { average: null },
        premiered: null,
        ended: null,
        image: null,
        url: `https://www.tvmaze.com/shows/${id}`,
    },
});

const app = new Hono().get("/", getShows);

const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("GET /api/shows", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        searchCache.clear();
    });

    it("searches TVmaze and answers the asked page of the genre", async () => {
        const fetchMock = respond([1, 2, 3, 4, 5].map((id) => tvmazeShow(id, id === 3 ? [] : ["Drama"])));
        vi.stubGlobal("fetch", fetchMock);

        const response = await app.request("/?q=doctor+who&genre=Drama&page=2");

        expect(response.status).toBe(200);
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.tvmaze.com/search/shows?q=doctor%20who",
            expect.objectContaining({ signal: expect.any(AbortSignal) }),
        );
        expect(await response.json()).toMatchObject({
            shows: [{ id: 5, name: "Show 5" }],
            genres: [{ genre: "Drama", count: 4 }],
            found: 5,
            genre: "Drama",
            total: 4,
            page: 2,
            perPage: 3,
        });
    });

    it("answers 400 and asks nothing of TVmaze without a query or with a wrong page", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        expect((await app.request("/")).status).toBe(400);
        expect((await app.request("/?q=%20")).status).toBe(400);
        expect((await app.request("/?q=dark&page=0")).status).toBe(400);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("answers 502 when TVmaze fails", async () => {
        vi.stubGlobal("fetch", respond({ message: "busy" }, 503));

        const response = await app.request("/?q=dark");

        expect(response.status).toBe(502);
    });

    it.each([
        ["not a list", { shows: [] }],
        ["a show without a name", [{ score: 1, show: { ...tvmazeShow(1, []).show, name: undefined } }]],
        ["a show with a text id", [{ score: 1, show: { ...tvmazeShow(1, []).show, id: "1" } }]],
    ])("answers 502 to a TVmaze answer of another shape: %s", async (_, body) => {
        vi.stubGlobal("fetch", respond(body));

        const response = await app.request("/?q=dark");

        expect(response.status).toBe(502);
    });
});
