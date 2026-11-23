import { sign } from "hono/jwt";
import { verifyToken } from "../verifyToken";

const now = (): number => Math.floor(Date.now() / 1000);

const token = async (claims: Record<string, unknown>, secret = "test-secret"): Promise<string> => {
    return await sign({ sub: "u1", typ: "access", iat: now(), exp: now() + 60, ...claims }, secret, "HS256");
};

describe("verifyToken", () => {
    beforeEach(() => {
        vi.stubEnv("JWT_SECRET", "test-secret");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it.each(["access", "refresh"] as const)("answers the user id of a valid %s token", async (kind) => {
        expect(await verifyToken(await token({ typ: kind }), kind)).toBe("u1");
    });

    it.each([
        ["a token of the other kind", async () => await token({ typ: "refresh" })],
        ["a token of no kind", async () => await token({ typ: undefined })],
        ["an expired token", async () => await token({ exp: now() - 60 })],
        ["a token of another secret", async () => await token({}, "other-secret")],
        ["a token without a user id", async () => await token({ sub: 1 })],
        ["a broken token", async () => "not.a.token"],
        ["no token", async () => ""],
    ])("answers null to %s", async (_case, make) => {
        expect(await verifyToken(await make(), "access")).toBeNull();
    });

    it.each([undefined, ""])("throws without a secret: %j", async (secret) => {
        vi.stubEnv("JWT_SECRET", secret);

        await expect(verifyToken(await token({}, "test-secret"), "access")).rejects.toThrow("JWT_SECRET is not set");
    });
});
