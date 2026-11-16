import { createApp } from "../createApp";

describe("createApp", () => {
  it("serves the routes under /api", async () => {
    const response = await createApp().request("/api/health");

    expect(response.status).toBe(200);
  });

  it("answers 404 for an unknown route", async () => {
    const response = await createApp().request("/api/unknown");

    expect(response.status).toBe(404);
  });
});
