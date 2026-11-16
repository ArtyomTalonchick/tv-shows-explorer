import { createApp } from "../createApp";

describe("createApp", () => {
  it("answers 404 for an unknown route", async () => {
    const response = await createApp().request("/api/unknown");

    expect(response.status).toBe(404);
  });
});
