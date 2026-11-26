import { z } from "zod";
import { fetchJson } from "../fetchJson";
import { HttpError } from "../HttpError";

const ITEM = z.object({ id: z.number() });

const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("fetchJson", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks the url with the signal and returns the answer as its schema reads it", async () => {
        const fetchMock = respond({ id: 1, extra: "dropped" });
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await expect(fetchJson("https://example.com/items", ITEM, { signal })).resolves.toEqual({ id: 1 });
        expect(fetchMock).toHaveBeenCalledWith("https://example.com/items", { signal });
    });

    it("sends the method and the headers it is given", async () => {
        const fetchMock = respond([]);
        vi.stubGlobal("fetch", fetchMock);
        const init = { method: "DELETE", headers: { "X-Request-Id": "id" } };

        await fetchJson("https://example.com/items/1", z.array(ITEM), init);

        expect(fetchMock).toHaveBeenCalledWith("https://example.com/items/1", init);
    });

    it("sends a body as JSON, with its content type next to the caller's headers", async () => {
        const fetchMock = respond({ id: 1 });
        vi.stubGlobal("fetch", fetchMock);

        await fetchJson("https://example.com/items/1", ITEM, {
            method: "PUT",
            headers: { "X-Request-Id": "id" },
            body: { name: "Dark" },
        });

        const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
        const headers = new Headers(init.headers);
        expect(init.method).toBe("PUT");
        expect(init.body).toBe('{"name":"Dark"}');
        expect(headers.get("Content-Type")).toBe("application/json");
        expect(headers.get("X-Request-Id")).toBe("id");
    });

    it("reads a 204 answer, which has no body, as undefined", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

        const removal = fetchJson("https://example.com/items/1", z.undefined(), { method: "DELETE" });

        await expect(removal).resolves.toBeUndefined();
    });

    it("rejects an answer of a wrong shape with the error of its schema", async () => {
        vi.stubGlobal("fetch", respond({ id: "1" }));

        await expect(fetchJson("https://example.com/items/1", ITEM)).rejects.toBeInstanceOf(z.ZodError);
    });

    it("rejects on a non-2xx answer with an HttpError that holds the status", async () => {
        vi.stubGlobal("fetch", respond({ message: "busy" }, 503));

        const failure = fetchJson("https://example.com/items", ITEM);

        await expect(failure).rejects.toThrow("Request failed with status 503");
        await expect(failure).rejects.toBeInstanceOf(HttpError);
        await expect(failure).rejects.toMatchObject({ status: 503 });
    });

    it("rejects when the request fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

        await expect(fetchJson("https://example.com/items", ITEM)).rejects.toThrow("offline");
    });
});
