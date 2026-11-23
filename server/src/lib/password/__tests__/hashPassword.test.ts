import { hashPassword } from "../hashPassword";

describe("hashPassword", () => {
    it("answers a salt and a hash in hex, with no password in them", async () => {
        const stored = await hashPassword("severance");

        expect(stored).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/);
        expect(stored).not.toContain("severance");
    });

    it("salts each hash, so one password gives two hashes", async () => {
        expect(await hashPassword("severance")).not.toBe(await hashPassword("severance"));
    });
});
