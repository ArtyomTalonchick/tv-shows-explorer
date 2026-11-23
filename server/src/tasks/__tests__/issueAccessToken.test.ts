import { verify } from "hono/jwt";
import { issueAccessToken } from "../issueAccessToken";

const USER = { id: "u1", email: "anna@example.com" };

describe("issueAccessToken", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.useRealTimers();
    });

    it("signs the user's id and email with the secret, as an access token for 1 minute", async () => {
        vi.stubEnv("JWT_SECRET", "test-secret");
        vi.useFakeTimers({ now: 1_000_000_000_000 });

        const payload = await verify(await issueAccessToken(USER), "test-secret", "HS256");

        expect(payload).toEqual({
            sub: "u1",
            email: "anna@example.com",
            typ: "access",
            iat: 1_000_000_000,
            exp: 1_000_000_000 + 60,
        });
    });

    it("is not taken with another secret", async () => {
        vi.stubEnv("JWT_SECRET", "test-secret");

        await expect(verify(await issueAccessToken(USER), "other-secret", "HS256")).rejects.toThrow();
    });

    it.each([undefined, ""])("throws without a secret: %j", async (secret) => {
        vi.stubEnv("JWT_SECRET", secret);

        await expect(issueAccessToken(USER)).rejects.toThrow("JWT_SECRET is not set");
    });
});
