import { healthResponseSchema } from "../healthResponseSchema";

describe("healthResponseSchema", () => {
    it("takes the answer of a server that is up", () => {
        expect(healthResponseSchema.parse({ status: "ok" })).toEqual({ status: "ok" });
    });

    it.each([{ status: "down" }, {}, null])("refuses %j", (answer) => {
        expect(healthResponseSchema.safeParse(answer).success).toBe(false);
    });
});
