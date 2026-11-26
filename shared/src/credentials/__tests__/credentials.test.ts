import { credentialsSchema, signInBodySchema } from "../credentials";
import { normalizeEmail } from "../normalizeEmail";

describe("credentialsSchema", () => {
    it.each(["anna@example.com", "  anna@example.com  ", "Anna.Smith+tv@mail.example.co.uk"])("takes %j", (email) => {
        expect(credentialsSchema.safeParse({ email, password: "severanc" }).success).toBe(true);
    });

    it.each(["", "anna", "anna@example", "@example.com", "anna@.com", "an na@example.com", "anna@@example.com"])(
        "refuses the email %j",
        (email) => {
            expect(credentialsSchema.safeParse({ email, password: "severanc" }).success).toBe(false);
        },
    );

    it("gives the email without its outer spaces", () => {
        const parsed = credentialsSchema.parse({ email: " anna@example.com ", password: "severanc" });

        expect(parsed.email).toBe("anna@example.com");
    });

    it("takes a password of 8 characters and more, counting spaces as typed", () => {
        expect(credentialsSchema.safeParse({ email: "anna@example.com", password: "severanc" }).success).toBe(true);
        expect(credentialsSchema.safeParse({ email: "anna@example.com", password: "  dark " }).success).toBe(false);
    });
});

describe("signInBodySchema", () => {
    it("takes any two strings, so an account of an older rule still signs in", () => {
        expect(signInBodySchema.safeParse({ email: "anna@example", password: "dark" }).success).toBe(true);
    });

    it.each([null, {}, { email: "anna@example.com" }, { email: 1, password: "severanc" }])("refuses %j", (body) => {
        expect(signInBodySchema.safeParse(body).success).toBe(false);
    });
});

describe("normalizeEmail", () => {
    it("drops the outer spaces and the case", () => {
        expect(normalizeEmail("  Anna@Example.COM ")).toBe("anna@example.com");
    });
});
