import { sessionResponseSchema } from "../sessionResponse";

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
