import { verify } from "hono/jwt";
import { issueTokens } from "../issueTokens";

const USER = { id: "u1", email: "anna@example.com" };

describe("issueTokens", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.useRealTimers();
    });

    it("answers an access token for 1 minute and a refresh token for 30 days", async () => {
        vi.stubEnv("JWT_SECRET", "test-secret");
        vi.useFakeTimers({ now: 1_000_000_000_000 });

        const { accessToken, refreshToken } = await issueTokens(USER);

        expect(await verify(accessToken, "test-secret", "HS256")).toEqual({
            sub: "u1",
            email: "anna@example.com",
            typ: "access",
            iat: 1_000_000_000,
            exp: 1_000_000_000 + 60,
        });
        expect(await verify(refreshToken, "test-secret", "HS256")).toEqual({
            sub: "u1",
            typ: "refresh",
            iat: 1_000_000_000,
            exp: 1_000_000_000 + 30 * 24 * 60 * 60,
        });
    });

    it("signs both tokens with the secret, so another one does not take them", async () => {
        vi.stubEnv("JWT_SECRET", "test-secret");

        const { accessToken, refreshToken } = await issueTokens(USER);

        await expect(verify(accessToken, "other-secret", "HS256")).rejects.toThrow();
        await expect(verify(refreshToken, "other-secret", "HS256")).rejects.toThrow();
    });

    it.each([undefined, ""])("throws without a secret: %j", async (secret) => {
        vi.stubEnv("JWT_SECRET", secret);

        await expect(issueTokens(USER)).rejects.toThrow("JWT_SECRET is not set");
    });
});
