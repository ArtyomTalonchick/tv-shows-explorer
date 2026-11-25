import type { SessionResponse } from "@tv-shows-explorer/shared";
import { keepSession } from "~/tasks/session/keepSession";
import { signIn } from "../signIn";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

vi.mock("~/tasks/session/keepSession", () => {
    return { keepSession: vi.fn() };
});

const CREDENTIALS = { email: "anna@example.com", password: "severance" };

describe("signIn", () => {
    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllGlobals();
    });

    it("sends the email and the password and keeps the session the server answers", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify(SESSION)));
        vi.stubGlobal("fetch", fetchMock);

        expect(await signIn(CREDENTIALS, null)).toBe("signed-in");

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe("/api/session");
        expect(init.method).toBe("POST");
        expect(init.body).toBe(JSON.stringify(CREDENTIALS));
        expect(keepSession).toHaveBeenCalledExactlyOnceWith(SESSION, null);
    });

    it("tells a refusal of the email and the password from a failure", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "wrong" }), { status: 401 }));

        expect(await signIn(CREDENTIALS, null)).toBe("wrong-credentials");
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

        expect(await signIn(CREDENTIALS, null)).toBe("failed");
        expect(keepSession).not.toHaveBeenCalled();
    });
});
