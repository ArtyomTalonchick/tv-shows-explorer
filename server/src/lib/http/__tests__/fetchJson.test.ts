import { z, ZodError } from "zod";
import { HttpError } from "~/lib/errors/HttpError";
import { fetchJson } from "../fetchJson";

const respond = (body: unknown, status = 200) =>
    vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status }));

const itemSchema = z.object({ id: z.number() });
const URL = "https://example.com/items";

describe("fetchJson", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks the url with the signal and returns the answer as the schema reads it", async () => {
        const fetchMock = respond({ id: 1, extra: true });
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await expect(fetchJson(URL, itemSchema, signal)).resolves.toEqual({ id: 1 });
        expect(fetchMock).toHaveBeenCalledWith(URL, { signal });
    });

    it("rejects with a ZodError on an answer of another shape", async () => {
        vi.stubGlobal("fetch", respond({ id: "1" }));

        await expect(fetchJson(URL, itemSchema, new AbortController().signal)).rejects.toBeInstanceOf(ZodError);
    });

    it("rejects with an HttpError of the status on a non-2xx answer", async () => {
        vi.stubGlobal("fetch", respond({ message: "busy" }, 503));

        await expect(fetchJson(URL, itemSchema, new AbortController().signal)).rejects.toThrow(
            "Request failed with status 503",
        );
        await expect(fetchJson(URL, itemSchema, new AbortController().signal)).rejects.toMatchObject({ status: 503 });
        await expect(fetchJson(URL, itemSchema, new AbortController().signal)).rejects.toBeInstanceOf(HttpError);
    });

    it("rejects when the request fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

        await expect(fetchJson(URL, itemSchema, new AbortController().signal)).rejects.toThrow("offline");
    });
});
