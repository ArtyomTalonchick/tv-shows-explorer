import { hashPassword } from "../hashPassword";
import { verifyPassword } from "../verifyPassword";

describe("verifyPassword", () => {
    it("takes the password that was hashed", async () => {
        expect(await verifyPassword("severance", await hashPassword("severance"))).toBe(true);
    });

    it.each(["Severance", "severance ", "", "dark"])("refuses another password: %j", async (password) => {
        expect(await verifyPassword(password, await hashPassword("severance"))).toBe(false);
    });

    it.each(["", "no-colon", ":", "abcd:", ":abcd", "zz:zz"])(
        "refuses a stored value of another shape: %j",
        async (stored) => {
            expect(await verifyPassword("severance", stored)).toBe(false);
        },
    );
});
