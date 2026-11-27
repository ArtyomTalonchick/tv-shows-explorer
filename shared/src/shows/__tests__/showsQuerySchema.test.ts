import { showsQuerySchema } from "../showsQuerySchema";

describe("showsQuerySchema", () => {
    it("reads the trimmed query, the genre and the page", () => {
        expect(showsQuerySchema.parse({ q: " dark ", genre: "Drama", page: "2" })).toEqual({
            query: "dark",
            genre: "Drama",
            page: 2,
        });
    });

    it("takes no genre and page 1 when they are left out or empty", () => {
        expect(showsQuerySchema.parse({ q: "dark" })).toEqual({ query: "dark", genre: null, page: 1 });
        expect(showsQuerySchema.parse({ q: "dark", genre: "" })).toEqual({ query: "dark", genre: null, page: 1 });
    });

    it("refuses a missing or blank query", () => {
        expect(showsQuerySchema.safeParse({}).success).toBe(false);
        expect(showsQuerySchema.safeParse({ q: "   " }).success).toBe(false);
    });

    it.each(["0", "-1", "1.5", "01", "two", ""])("refuses the page %j", (page) => {
        expect(showsQuerySchema.safeParse({ q: "dark", page }).success).toBe(false);
    });
});
