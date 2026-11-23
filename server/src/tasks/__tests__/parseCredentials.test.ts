import { parseCredentials } from "../parseCredentials";

describe("parseCredentials", () => {
    it("takes an email and a password as they are, leaving the rule to the caller", () => {
        expect(parseCredentials('{"email":" Anna@Example.com ","password":"dark"}')).toEqual({
            email: " Anna@Example.com ",
            password: "dark",
        });
    });

    it("drops any other field", () => {
        expect(parseCredentials('{"email":"a@b.c","password":"severance","admin":true}')).toEqual({
            email: "a@b.c",
            password: "severance",
        });
    });

    it.each([
        "",
        "not json",
        "null",
        '"a@b.c"',
        "[]",
        '{"email":"a@b.c"}',
        '{"password":"severance"}',
        '{"email":1,"password":"severance"}',
        '{"email":"a@b.c","password":null}',
    ])("refuses %j", (body) => {
        expect(parseCredentials(body)).toBeNull();
    });
});
