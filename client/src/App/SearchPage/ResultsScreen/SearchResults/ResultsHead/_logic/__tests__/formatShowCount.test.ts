import { formatShowCount } from "../formatShowCount";

describe("formatShowCount", () => {
    it.each([
        [9, 9, null, "9 shows"],
        [1, 1, null, "1 show"],
        [0, 0, null, "0 shows"],
        [9, 4, "Drama", "4 of 9 shows · Drama"],
    ])("counts %i found shows, %i of the genre %s, as «%s»", (found, total, genre, text) => {
        expect(formatShowCount({ found, total, genre })).toBe(text);
    });
});
