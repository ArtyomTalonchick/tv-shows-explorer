import { wakeServer } from "../wakeServer";

describe("wakeServer", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks the server whether it is up", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({ status: "ok" })));
        vi.stubGlobal("fetch", fetchMock);
        const { signal } = new AbortController();

        await wakeServer(signal);

        expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/health", { signal });
    });

    it.each([
        ["a failed answer", async () => new Response(null, { status: 503 })],
        ["an answer of a wrong shape", async () => new Response(JSON.stringify({ status: "down" }))],
        [
            "a network error",
            async () => {
                throw new TypeError("Failed to fetch");
            },
        ],
    ])("resolves on %s", async (_, answer) => {
        vi.stubGlobal("fetch", vi.fn(answer));

        await expect(wakeServer(new AbortController().signal)).resolves.toBeUndefined();
    });
});
