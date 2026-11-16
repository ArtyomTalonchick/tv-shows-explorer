import { Hono } from "hono";
import { getHealth } from "../getHealth";

const app = new Hono().get("/", getHealth);

describe("GET /api/health", () => {
    it("answers that the server is up", async () => {
        const response = await app.request("/");

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ status: "ok" });
    });
});
