import { createApp } from "../createApp";

describe("createApp", () => {
  it("answers the health check", async () => {
    const response = await createApp().request("/api/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("answers 404 for an unknown route", async () => {
    const response = await createApp().request("/api/unknown");

    expect(response.status).toBe(404);
  });
});
