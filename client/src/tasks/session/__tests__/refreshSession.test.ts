import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { refreshSession } from "../refreshSession";

const KEPT: SessionResponse = {
    accessToken: "old-access",
    refreshToken: "old-refresh",
    user: { id: "u1", email: "anna@example.com" },
};

const FRESH: SessionResponse = { ...KEPT, accessToken: "new-access", refreshToken: "new-refresh" };

const answer = (status: number, body: unknown): Response => new Response(JSON.stringify(body), { status });

describe("refreshSession", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: KEPT });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("exchanges the kept refresh token for a new session", async () => {
        const fetchMock = vi.fn(async () => answer(200, FRESH));
        vi.stubGlobal("fetch", fetchMock);

        await refreshSession(new AbortController().signal);

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe("/api/session/refresh");
        expect(init.method).toBe("POST");
        expect(init.body).toBe(JSON.stringify({ refreshToken: "old-refresh" }));
        expect(useSessionStore.getState().session).toEqual(FRESH);
    });

    it("sends nothing for a guest", async () => {
        useSessionStore.setState({ session: null });
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        await refreshSession(new AbortController().signal);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(useSessionStore.getState().session).toBeNull();
    });

    it.each([401, 400])("makes the user a guest when the server refuses the token with %i", async (status) => {
        vi.stubGlobal("fetch", async () => answer(status, { error: "refused" }));

        await refreshSession(new AbortController().signal);

        expect(useSessionStore.getState().session).toBeNull();
    });

    it("keeps the session when there is no answer or the server fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockRejectedValueOnce(new TypeError("offline")).mockResolvedValue(answer(500, {})),
        );

        await refreshSession(new AbortController().signal);
        await refreshSession(new AbortController().signal);

        expect(useSessionStore.getState().session).toEqual(KEPT);
    });

    it.each([
        { during: "a sign-out", now: null, status: 200, body: FRESH },
        { during: "another sign-in", now: { ...FRESH, refreshToken: "other-refresh" }, status: 401, body: {} },
    ])("drops an answer that comes after $during", async ({ now, status, body }) => {
        vi.stubGlobal("fetch", async () => {
            useSessionStore.setState({ session: now });
            return answer(status, body);
        });

        await refreshSession(new AbortController().signal);

        expect(useSessionStore.getState().session).toEqual(now);
    });
});
