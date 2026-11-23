import { isValidEmail } from "../isValidEmail";
import { isValidPassword } from "../isValidPassword";
import { normalizeEmail } from "../normalizeEmail";

describe("isValidEmail", () => {
    it.each(["anna@example.com", "  anna@example.com  ", "Anna.Smith+tv@mail.example.co.uk"])("takes %j", (email) => {
        expect(isValidEmail(email)).toBe(true);
    });

    it.each(["", "anna", "anna@example", "@example.com", "anna@.com", "an na@example.com", "anna@@example.com"])(
        "refuses %j",
        (email) => {
            expect(isValidEmail(email)).toBe(false);
        },
    );
});

describe("isValidPassword", () => {
    it("takes 8 characters and more", () => {
        expect(isValidPassword("severanc")).toBe(true);
        expect(isValidPassword("a much longer password")).toBe(true);
    });

    it("refuses fewer than 8, counting spaces as typed", () => {
        expect(isValidPassword("dark")).toBe(false);
        expect(isValidPassword("  dark ")).toBe(false);
    });
});

describe("normalizeEmail", () => {
    it("drops the outer spaces and the case", () => {
        expect(normalizeEmail("  Anna@Example.COM ")).toBe("anna@example.com");
    });
});
