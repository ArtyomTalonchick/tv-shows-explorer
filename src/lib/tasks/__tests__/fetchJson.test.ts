import { fetchJson } from "../fetchJson";

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

    await expect(fetchJson("https://example.com/items", signal)).resolves.toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/items", { signal });
  });

  it("rejects on a non-2xx answer", async () => {
    vi.stubGlobal("fetch", respond({ message: "busy" }, 503));

    await expect(fetchJson("https://example.com/items", new AbortController().signal)).rejects.toThrow(
      "Request failed with status 503",
    );
  });

  it("rejects when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    await expect(fetchJson("https://example.com/items", new AbortController().signal)).rejects.toThrow("offline");
  });
});
