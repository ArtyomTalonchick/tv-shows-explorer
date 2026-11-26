import { normalizeEmail } from "../normalizeEmail";

describe("normalizeEmail", () => {
    it("drops the outer spaces and the case", () => {
        expect(normalizeEmail("  Anna@Example.COM ")).toBe("anna@example.com");
    });
});
