import { refreshBodySchema, sessionResponseSchema } from "../session";

const SESSION = { accessToken: "a", refreshToken: "r", user: { id: "u1", email: "anna@example.com" } };

describe("sessionResponseSchema", () => {
    it("takes the tokens and the user", () => {
        expect(sessionResponseSchema.parse(SESSION)).toEqual(SESSION);
    });

    it.each([
        { ...SESSION, accessToken: undefined },
        { ...SESSION, user: null },
        { ...SESSION, user: { id: 1, email: "anna@example.com" } },
    ])("refuses %j", (answer) => {
        expect(sessionResponseSchema.safeParse(answer).success).toBe(false);
    });
});

describe("refreshBodySchema", () => {
    it("takes a string refreshToken and refuses anything else", () => {
        expect(refreshBodySchema.safeParse({ refreshToken: "r" }).success).toBe(true);
        expect(refreshBodySchema.safeParse({ refreshToken: 1 }).success).toBe(false);
        expect(refreshBodySchema.safeParse("r").success).toBe(false);
    });
});
