import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { signUp } from "../signUp";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

const CREDENTIALS = { email: "anna@example.com", password: "severance" };

describe("signUp", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: null });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("sends the email and the password and keeps the session of the new account", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify(SESSION), { status: 201 }));
        vi.stubGlobal("fetch", fetchMock);

        expect(await signUp(CREDENTIALS)).toBe("signed-up");

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe("/api/users");
        expect(init.method).toBe("POST");
        expect(init.body).toBe(JSON.stringify(CREDENTIALS));
        expect(useSessionStore.getState().session).toEqual(SESSION);
    });

    it("tells a taken email from a failure", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "taken" }), { status: 409 }));

        expect(await signUp(CREDENTIALS)).toBe("email-taken");
        expect(useSessionStore.getState().session).toBeNull();
    });

    it.each([
        ["a server error", async () => new Response(JSON.stringify({ error: "busy" }), { status: 502 })],
        [
            "no answer",
            async () => {
                throw new TypeError("Failed to fetch");
            },
        ],
    ])("fails on %s and keeps the guest", async (_, fetchMock) => {
        vi.stubGlobal("fetch", fetchMock);

        expect(await signUp(CREDENTIALS)).toBe("failed");
        expect(useSessionStore.getState().session).toBeNull();
    });
});
