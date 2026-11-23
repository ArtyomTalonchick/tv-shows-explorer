import { verify } from "hono/jwt";
import { startSession } from "../startSession";

const USER = { id: "u1", email: "anna@example.com" };

describe("startSession", () => {
    beforeEach(() => {
        vi.stubEnv("JWT_SECRET", "test-secret");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("answers a pair of tokens of the user, and the user", async () => {
        const { accessToken, refreshToken, user } = await startSession(USER);

        expect(user).toEqual(USER);
        expect(await verify(accessToken, "test-secret", "HS256")).toMatchObject({ sub: "u1", typ: "access" });
        expect(await verify(refreshToken, "test-secret", "HS256")).toMatchObject({ sub: "u1", typ: "refresh" });
    });
});
