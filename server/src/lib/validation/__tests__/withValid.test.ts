import { Hono } from "hono";
import { z } from "zod";
import { withValid } from "../withValid";

const app = new Hono()
    .get(
        "/",
        ...withValid({ query: z.object({ q: z.string().min(1) }) }, async (context, { query }) => {
            return context.json({ got: query.q });
        }),
    )
    .put(
        "/:id",
        ...withValid(
            { param: z.object({ id: z.string().regex(/^\d+$/) }), json: z.object({ name: z.string() }) },
            async (context, { param, json }) => {
                return context.json({ id: param.id, name: json.name });
            },
        ),
    );

const put = async (path: string, body: string): Promise<Response> => {
    return await app.request(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body });
};

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

    it("checks every part and hands the handler each one by its name", async () => {
        const response = await put("/7", '{"name":"Dark"}');

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ id: "7", name: "Dark" });
    });

    it.each([
        ["the path", "/seven", '{"name":"Dark"}', "id"],
        ["the body", "/7", '{"name":1}', "name"],
    ])("answers 400 when %s is refused", async (_part, path, body, field) => {
        const response = await put(path, body);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: expect.stringContaining(field) });
    });
});
