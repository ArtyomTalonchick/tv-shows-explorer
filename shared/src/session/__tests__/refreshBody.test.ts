import { refreshBodySchema } from "../refreshBody";

describe("refreshBodySchema", () => {
    it("takes a string refreshToken and refuses anything else", () => {
        expect(refreshBodySchema.safeParse({ refreshToken: "r" }).success).toBe(true);
        expect(refreshBodySchema.safeParse({ refreshToken: 1 }).success).toBe(false);
        expect(refreshBodySchema.safeParse("r").success).toBe(false);
    });
});
