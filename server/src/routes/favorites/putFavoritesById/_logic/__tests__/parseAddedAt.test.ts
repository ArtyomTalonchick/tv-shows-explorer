import { parseAddedAt } from "../parseAddedAt";

const NOW = 1_763_300_000_000;

describe("parseAddedAt", () => {
    it.each(["", "  ", "{}"])("adds now for the body %j", (text) => {
        expect(parseAddedAt(text, NOW)).toBe(NOW);
    });

    it("keeps the given time, for Undo", () => {
        expect(parseAddedAt('{ "addedAt": 1700000000000 }', NOW)).toBe(1_700_000_000_000);
    });

    it.each(["not json", "[]", "null", "5", '{ "addedAt": "1" }', '{ "addedAt": 0 }', '{ "addedAt": 1.5 }'])(
        "takes no time from the body %j",
        (text) => {
            expect(parseAddedAt(text, NOW)).toBeNull();
        },
    );
});
