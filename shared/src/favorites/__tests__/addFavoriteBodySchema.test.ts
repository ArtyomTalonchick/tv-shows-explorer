import { addFavoriteBodySchema } from "../addFavoriteBodySchema";

describe("addFavoriteBodySchema", () => {
    it("takes no addedAt, or a time to put a show back", () => {
        expect(addFavoriteBodySchema.parse({})).toEqual({});
        expect(addFavoriteBodySchema.parse({ addedAt: 1_700_000_000_000 })).toEqual({ addedAt: 1_700_000_000_000 });
    });

    it.each([[], null, 5, { addedAt: "1" }, { addedAt: 0 }, { addedAt: 1.5 }])("refuses %j", (body) => {
        expect(addFavoriteBodySchema.safeParse(body).success).toBe(false);
    });
});
