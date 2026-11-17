import { parseClientId } from "../parseClientId";

describe("parseClientId", () => {
    it("reads a UUID in lower case", () => {
        expect(parseClientId("0B8F3D6E-6A51-4C2E-9F4B-3F1E2D7C9A10")).toBe("0b8f3d6e-6a51-4c2e-9f4b-3f1e2d7c9a10");
    });

    it.each([
        undefined,
        "",
        "constructor",
        "0b8f3d6e6a514c2e9f4b3f1e2d7c9a10",
        " 0b8f3d6e-6a51-4c2e-9f4b-3f1e2d7c9a10",
    ])("reads no client id from %j", (header) => {
        expect(parseClientId(header)).toBeNull();
    });
});
