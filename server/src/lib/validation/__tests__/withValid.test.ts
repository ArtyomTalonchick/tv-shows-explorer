import { Hono } from "hono";
import { z } from "zod";
import { withValid } from "../withValid";

const app = new Hono().get(
    "/",
    ...withValid({ query: z.object({ q: z.string().min(1) }) }, async (context, { query }) => {
        return context.json({ got: query.q });
    }),
);

describe("withValid", () => {
    it("hands the handler the checked part by its name", async () => {
        const response = await app.request("/?q=dark");

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ got: "dark" });
    });

    it("answers 400 with what is wrong to a part its schema refuses", async () => {
        const response = await app.request("/");

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: expect.stringContaining("q") });
    });

    it("refuses two parts at once for now", () => {
        const schema = z.object({});

        expect(() => withValid({ json: schema, query: schema }, async (context) => context.body(null))).toThrow(
            "withValid checks one part of a request for now, got: json, query",
        );
    });
});
