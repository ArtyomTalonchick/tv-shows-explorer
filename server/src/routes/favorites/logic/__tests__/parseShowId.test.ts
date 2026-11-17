import { parseShowId } from "../parseShowId";

describe("parseShowId", () => {
    it("reads a whole number from 1", () => {
        expect(parseShowId("1")).toBe(1);
        expect(parseShowId("17861")).toBe(17861);
    });

    it.each(["0", "-1", "1.5", "01", "dark", "", "99999999999999999999"])("reads no id from %j", (param) => {
        expect(parseShowId(param)).toBeNull();
    });
});
