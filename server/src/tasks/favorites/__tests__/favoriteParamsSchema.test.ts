import { favoriteParamsSchema } from "../favoriteParamsSchema";

describe("favoriteParamsSchema", () => {
    it("reads a whole number from 1", () => {
        expect(favoriteParamsSchema.parse({ id: "1" })).toEqual({ id: 1 });
        expect(favoriteParamsSchema.parse({ id: "17861" })).toEqual({ id: 17861 });
    });

    it.each(["0", "-1", "1.5", "01", "dark", "", "99999999999999999999"])("reads no id from %j", (id) => {
        expect(favoriteParamsSchema.safeParse({ id }).success).toBe(false);
    });
});
