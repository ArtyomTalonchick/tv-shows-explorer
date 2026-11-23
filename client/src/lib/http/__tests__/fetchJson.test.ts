import { fetchJson } from "../fetchJson";
import { HttpError } from "../HttpError";

const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("fetchJson", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks the url with the signal and returns the parsed answer", async () => {
        const fetchMock = respond({ id: 1 });
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await expect(fetchJson("https://example.com/items", { signal })).resolves.toEqual({ id: 1 });
        expect(fetchMock).toHaveBeenCalledWith("https://example.com/items", { signal });
    });

    it("sends the method, the headers and the body it is given", async () => {
        const fetchMock = respond([]);
        vi.stubGlobal("fetch", fetchMock);
        const init = { method: "PUT", headers: { "X-Client-Id": "id" }, body: "{}" };

        await fetchJson("https://example.com/items/1", init);

        expect(fetchMock).toHaveBeenCalledWith("https://example.com/items/1", init);
    });

    it("resolves undefined to a 204 answer, which has no body", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

        await expect(fetchJson<void>("https://example.com/items/1", { method: "DELETE" })).resolves.toBeUndefined();
    });

    it("rejects on a non-2xx answer with an HttpError that holds the status", async () => {
        vi.stubGlobal("fetch", respond({ message: "busy" }, 503));

        const failure = fetchJson("https://example.com/items");

        await expect(failure).rejects.toThrow("Request failed with status 503");
        await expect(failure).rejects.toBeInstanceOf(HttpError);
        await expect(failure).rejects.toMatchObject({ status: 503 });
    });

    it("rejects when the request fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

        await expect(fetchJson("https://example.com/items")).rejects.toThrow("offline");
    });
});
