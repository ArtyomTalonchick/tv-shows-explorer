import { verify } from "hono/jwt";
import { issueToken } from "../issueToken";

const USER = { id: "u1", email: "anna@example.com" };

describe("issueToken", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.useRealTimers();
    });

    it("signs the user's id and email with the secret, for 7 days", async () => {
        vi.stubEnv("JWT_SECRET", "test-secret");
        vi.useFakeTimers({ now: 1_000_000_000_000 });

        const payload = await verify(await issueToken(USER), "test-secret", "HS256");

        expect(payload).toEqual({
            sub: "u1",
            email: "anna@example.com",
            iat: 1_000_000_000,
            exp: 1_000_000_000 + 7 * 24 * 60 * 60,
        });
    });

    it("is not taken with another secret", async () => {
        vi.stubEnv("JWT_SECRET", "test-secret");

        await expect(verify(await issueToken(USER), "other-secret", "HS256")).rejects.toThrow();
    });

    it.each([undefined, ""])("throws without a secret: %j", async (secret) => {
        vi.stubEnv("JWT_SECRET", secret);

        await expect(issueToken(USER)).rejects.toThrow("JWT_SECRET is not set");
    });
});
