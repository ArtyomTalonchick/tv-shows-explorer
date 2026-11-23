import { createApp } from "../createApp";

const SITE = "https://artyomtalonchick.github.io";

describe("createApp", () => {
    it("serves the routes under /api", async () => {
        const response = await createApp().request("/api/health");

        expect(response.status).toBe(200);
    });

    it("answers 404 for an unknown route", async () => {
        const response = await createApp().request("/api/unknown");

        expect(response.status).toBe(404);
    });

    it("lets the site on GitHub Pages call the API", async () => {
        const response = await createApp().request("/api/health", { headers: { Origin: SITE } });

        expect(response.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
    });

    it("allows the methods and headers of the favorites and the accounts in a preflight", async () => {
        const response = await createApp().request("/api/users", {
            method: "OPTIONS",
            headers: {
                Origin: SITE,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Authorization, Content-Type",
            },
        });

        expect(response.status).toBe(204);
        expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET,POST,PUT,DELETE");
        expect(response.headers.get("Access-Control-Allow-Headers")).toBe("X-Client-Id,Authorization,Content-Type");
    });

    it("does not let another site call the API", async () => {
        const response = await createApp().request("/api/health", { headers: { Origin: "https://example.com" } });

        expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    });
});
