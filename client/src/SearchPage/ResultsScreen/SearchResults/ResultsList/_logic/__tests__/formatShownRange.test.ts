import { formatShownRange } from "../formatShownRange";

describe("formatShownRange", () => {
    it.each([
        { range: { first: 4, last: 6, total: 8 }, text: "Shows 4–6 of 8" },
        { range: { first: 7, last: 8, total: 8 }, text: "Shows 7–8 of 8" },
        { range: { first: 10, last: 10, total: 10 }, text: "Shows 10 of 10" },
    ])("names $range as «$text»", ({ range, text }) => {
        expect(formatShownRange(range)).toBe(text);
    });
});
