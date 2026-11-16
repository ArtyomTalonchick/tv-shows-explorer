import { createApp } from "@/createApp";

describe("GET /api/health", () => {
  it("answers that the server is up", async () => {
    const response = await createApp().request("/api/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });
});
