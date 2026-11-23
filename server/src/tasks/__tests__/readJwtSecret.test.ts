import { readJwtSecret } from "../readJwtSecret";

describe("readJwtSecret", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("reads the secret of JWT_SECRET", () => {
        vi.stubEnv("JWT_SECRET", "test-secret");

        expect(readJwtSecret()).toBe("test-secret");
    });

    it.each([undefined, ""])("throws without a secret: %j", (secret) => {
        vi.stubEnv("JWT_SECRET", secret);

        expect(() => readJwtSecret()).toThrow("JWT_SECRET is not set");
    });
});
