import { sign, verify } from "hono/jwt";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";
import { session } from "~/routes/session/session";

vi.mock("~/routes/_stores/usersStore/usersStore", () => {
    return { usersStore: { create: vi.fn(), get: vi.fn(), findByEmail: vi.fn() } };
});

const now = (): number => Math.floor(Date.now() / 1000);

const token = async (claims: Record<string, unknown> = {}, secret = "test-secret"): Promise<string> => {
    return await sign({ sub: "u1", typ: "refresh", iat: now(), exp: now() + 60, ...claims }, secret, "HS256");
};

const refresh = async (body: string) => {
    const response = await session.request("/refresh", { method: "POST", body });
    return { status: response.status, body: (await response.json()) as unknown };
};

describe("POST /refresh", () => {
    beforeEach(() => {
        vi.stubEnv("JWT_SECRET", "test-secret");
        vi.mocked(usersStore.get).mockImplementation(async (id) => {
            return id === "u1"
                ? { id: "u1", email: "anna@example.com", passwordHash: "salt:hash", createdAt: 1 }
                : null;
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllEnvs();
    });

    it("answers a new pair of tokens and the user for a valid refresh token", async () => {
        const { status, body } = await refresh(JSON.stringify({ refreshToken: await token() }));

        expect(status).toBe(200);
        const { accessToken, refreshToken, user } = body as SessionResponse;
        expect(user).toEqual({ id: "u1", email: "anna@example.com" });
        expect(await verify(accessToken, "test-secret", "HS256")).toMatchObject({ sub: "u1", typ: "access" });
        expect(await verify(refreshToken, "test-secret", "HS256")).toMatchObject({ sub: "u1", typ: "refresh" });
    });

    it("never answers the password hash", async () => {
        const { body } = await refresh(JSON.stringify({ refreshToken: await token() }));

        expect(JSON.stringify(body)).not.toContain("salt:hash");
    });

    it.each([
        ["an expired refresh token", async () => await token({ exp: now() - 60 })],
        ["an access token", async () => await token({ typ: "access" })],
        ["a token of another secret", async () => await token({}, "other-secret")],
        ["a broken token", async () => "not.a.token"],
        ["the token of an account that is gone", async () => await token({ sub: "u2" })],
    ])("answers 401 to %s", async (_case, make) => {
        const response = await refresh(JSON.stringify({ refreshToken: await make() }));

        expect(response).toEqual({
            status: 401,
            body: { error: "Sign in again: the refresh token is not valid" },
        });
    });

    it.each(["not json", "null", "{}", '{"refreshToken":1}'])("answers 400 to %j", async (body) => {
        const response = await refresh(body);

        expect(response.status).toBe(400);
        expect(usersStore.get).not.toHaveBeenCalled();
    });
});
