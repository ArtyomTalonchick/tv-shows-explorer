import { HttpError, type SessionResponse } from "@tv-shows-explorer/shared";
import { z } from "zod";
import { useSessionStore } from "~/stores/useSessionStore";
import { fetchAsUser } from "../fetchAsUser";

const KEPT: SessionResponse = {
    accessToken: "old-access",
    refreshToken: "old-refresh",
    user: { id: "u1", email: "anna@example.com" },
};

const FRESH: SessionResponse = { ...KEPT, accessToken: "new-access", refreshToken: "new-refresh" };

// The answer the tests ask for: a list of numbers.
const NUMBERS = z.array(z.number());

const answer = (status: number, body: unknown): Response => new Response(JSON.stringify(body), { status });

// The `Authorization` header of each request the mock was called with, and its URL.
const sent = (fetchMock: ReturnType<typeof vi.fn>): [string, string | null][] =>
    fetchMock.mock.calls.map(([url, init]) => [
        url as string,
        new Headers((init as RequestInit).headers).get("Authorization"),
    ]);

describe("fetchAsUser", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: KEPT });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("sends the access token and keeps the caller's headers", async () => {
        const fetchMock = vi.fn(async () => answer(200, [1]));
        vi.stubGlobal("fetch", fetchMock);

        expect(await fetchAsUser("/api/favorites", NUMBERS, { headers: { "X-Test": "yes" } })).toEqual([1]);

        const init = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(new Headers(init[1].headers).get("X-Test")).toBe("yes");
        expect(sent(fetchMock)).toEqual([["/api/favorites", "Bearer old-access"]]);
    });

    it("sends no token for a guest", async () => {
        useSessionStore.setState({ session: null });
        const fetchMock = vi.fn(async () => answer(200, []));
        vi.stubGlobal("fetch", fetchMock);

        await fetchAsUser("/api/favorites", NUMBERS);

        expect(sent(fetchMock)).toEqual([["/api/favorites", null]]);
    });

    it("refreshes the session once on a 401 and repeats the request with the new token", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(answer(401, {}))
            .mockResolvedValueOnce(answer(200, FRESH))
            .mockResolvedValueOnce(answer(200, [1]));
        vi.stubGlobal("fetch", fetchMock);

        expect(await fetchAsUser("/api/favorites", NUMBERS)).toEqual([1]);

        expect(sent(fetchMock)).toEqual([
            ["/api/favorites", "Bearer old-access"],
            ["/api/session/refresh", null],
            ["/api/favorites", "Bearer new-access"],
        ]);
        expect(useSessionStore.getState().session).toEqual(FRESH);
    });

    it("leaves the 401 to the caller and makes the user a guest when the refresh is refused", async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(answer(401, {})).mockResolvedValueOnce(answer(401, {}));
        vi.stubGlobal("fetch", fetchMock);

        await expect(fetchAsUser("/api/favorites", NUMBERS)).rejects.toEqual(new HttpError(401));

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(useSessionStore.getState().session).toBeNull();
    });

    it("does not repeat a request when the refresh fails", async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(answer(401, {})).mockResolvedValueOnce(answer(503, {}));
        vi.stubGlobal("fetch", fetchMock);

        await expect(fetchAsUser("/api/favorites", NUMBERS)).rejects.toEqual(new HttpError(401));

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(useSessionStore.getState().session).toEqual(KEPT);
    });

    it("rejects any other error at once, with no refresh", async () => {
        const fetchMock = vi.fn(async () => answer(502, {}));
        vi.stubGlobal("fetch", fetchMock);

        await expect(fetchAsUser("/api/favorites", NUMBERS)).rejects.toEqual(new HttpError(502));

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
