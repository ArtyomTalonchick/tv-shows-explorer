import type { SessionResponse } from "@tv-shows-explorer/shared";
import { keepSession } from "~/tasks/session/keepSession";
import { signUp } from "../signUp";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

vi.mock("~/tasks/session/keepSession", () => {
    return { keepSession: vi.fn() };
});

const CREDENTIALS = { email: "anna@example.com", password: "severance" };

describe("signUp", () => {
    afterEach(() => {
        vi.resetAllMocks();
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
        expect(keepSession).toHaveBeenCalledExactlyOnceWith(SESSION);
    });

    it("tells a taken email from a failure", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "taken" }), { status: 409 }));

        expect(await signUp(CREDENTIALS)).toBe("email-taken");
        expect(keepSession).not.toHaveBeenCalled();
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
        expect(keepSession).not.toHaveBeenCalled();
    });
});
