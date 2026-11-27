import { signInBodySchema } from "../signInBodySchema";

describe("signInBodySchema", () => {
    it("takes any two strings, so an account of an older rule still signs in", () => {
        expect(signInBodySchema.safeParse({ email: "anna@example", password: "dark" }).success).toBe(true);
    });

    it.each([null, {}, { email: "anna@example.com" }, { email: 1, password: "severanc" }])("refuses %j", (body) => {
        expect(signInBodySchema.safeParse(body).success).toBe(false);
    });
});
